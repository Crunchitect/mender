import { printConfig } from '@/data/PrintConfig';
import { exportFile as exportBlob, downloadBlob } from './exportFile';
import JSZip from 'jszip';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { dashboardData } from '@/data/Printing';

const sleep = async (ms: number) => await new Promise((f) => setTimeout(f, ms));

export async function exportFile(ext: string) {
    const encoder = new TextEncoder();
    const extension = <'STL' | 'OBJ' | 'TEMPL' | 'GCODE'>ext;
    const polygon: { [name: string]: [number, number][] } = {};
    printConfig.value!.brokenModels.forEach((e, i) => (polygon[`polygon${i}`] = e.model));
    switch (extension) {
        case 'STL':
        case 'OBJ':
        case 'TEMPL':
            exportBlob(polygon, 'printQueue', extension);
            return;
    }
    const ws = new WebSocket('ws://127.0.0.1:1533');
    const zip = new JSZip();
    const stl = new STLExporter();
    await new Promise<void>((resolve) => {
        ws.onopen = () => resolve();
    });
    for (const name in polygon) {
        console.log(name);
        const poly = polygon[name];
        const shape = new THREE.Shape();
        shape.moveTo(...poly[0]);
        for (let i = 1; i < poly.length; i++) {
            shape.lineTo(...poly[i]);
        }
        shape.lineTo(...poly[0]);
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: printConfig.value.depth });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        const text = stl.parse(mesh);
        zip.file(`${name}.stl`, text);
        console.log('ws connected');
        ws.send(text);
        const gcode = await new Promise<string>((resolve) => {
            ws.onmessage = ({ data }) => {
                console.log(data);
                resolve(data);
            };
        });
        console.log('sliced');
        zip.file(`${name}.gcode`, gcode);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, 'printQueue');
    ws.close();
    return;
}

export async function printFile() {
    if (!('serial' in navigator)) return;
    //@ts-ignore
    const port = await navigator.serial.requestPort();

    const ws = new WebSocket('ws://127.0.0.1:1533');
    const stl = new STLExporter();
    await new Promise<void>((resolve) => {
        ws.onopen = () => resolve();
    });
    const polygon: { [name: string]: [number, number][] } = {};
    printConfig.value!.brokenModels.forEach((e, i) => (polygon[`polygon${i}`] = e.model));
    let progressAll = 0;
    for (const name in polygon) {
        console.log(name);
        const poly = polygon[name];
        const shape = new THREE.Shape();
        shape.moveTo(...poly[0]);
        for (let i = 1; i < poly.length; i++) {
            shape.lineTo(...poly[i]);
        }
        shape.lineTo(...poly[0]);
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: printConfig.value.depth });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        const text = stl.parse(mesh);
        console.log('ws connected');
        ws.send(text);
        const gcode = await new Promise<string>((resolve) => {
            ws.onmessage = ({ data }) => {
                // console.log(data);
                resolve(data);
            };
        });
        dashboardData.value.printingModel = poly;
        dashboardData.value.STLCode = text;
        dashboardData.value.GCode = gcode;
        await printGCode(port, gcode);
        console.log('printed');
        progressAll++;
        dashboardData.value.progressAll = ~~((progressAll / Object.keys(polygon).length) * 100);
    }

    ws.close();
}

async function printGCode(port: SerialPort, gcode: string) {
    await port.open({ baudRate: 115200 });
    const instructions = gcode.split('\n');
    let gCodeDone = 0;
    for (const instruction of instructions) {
        const formatted = instruction.replace(/;.*/, '');
        if (!formatted) {
            gCodeDone++;
            continue;
        }
        const encoder = new TextEncoder();
        const writer = port.writable.getWriter();
        console.log(`Instruction #${gCodeDone}: ${formatted}`);
        const encoded = encoder.encode(formatted + '\r\n');
        console.log(encoded);
        await writer.write(encoded);
        writer.releaseLock();

        // console.log('written');
        const aborter = new AbortController();
        const decoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(decoder.writable);
        const reader = decoder.readable.getReader();

        let resp = '';
        while (true) {
            const { value, done } = await reader.read();
            console.log('read!');
            console.log(resp, value);
            resp += value;
            console.log(encoder.encode(value));
            if (done || resp.split('\n').filter((line) => line.match(/^ok/)).length) {
                break;
            }
        }
        console.log('canceling readers/writers');
        aborter.abort();
        reader.cancel();
        await readableStreamClosed.catch(() => {});
        reader.releaseLock();

        gCodeDone++;
        dashboardData.value.progress = ((gCodeDone / instructions.length) * 100).toPrecision(3);
        console.log(`GCode inst finished`);
    }
    port.close();
}
