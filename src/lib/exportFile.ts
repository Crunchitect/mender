import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import JSZip from 'jszip';
import { printConfig } from '@/data/PrintConfig';

type Polygons = { [name: string]: [number, number][] };
type Extensions = 'TEMPL' | 'OBJ' | 'STL';

export async function exportFile(templ: Polygons, fileName: string, extension: Extensions) {
    const downloadText = (text: string) => {
        const encoder = new TextEncoder();
        const url = URL.createObjectURL(new Blob([encoder.encode(text)]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${extension.toLowerCase()}`;
        link.click();
    };

    const downloadBlob = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.zip`;
        link.click();
    };

    switch (extension) {
        case 'TEMPL':
            downloadText(JSON.stringify(templ));
            return;
        case 'STL': {
            const zip = new JSZip();
            const stl = new STLExporter();
            for (const name in templ) {
                const poly = templ[name];
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
            }
            const blob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(blob);
            return;
        }
        case 'OBJ': {
            const zip = new JSZip();
            const obj = new OBJExporter();
            for (const name in templ) {
                const poly = templ[name];
                const shape = new THREE.Shape();
                shape.moveTo(...poly[0]);
                for (let i = 1; i < poly.length; i++) {
                    shape.lineTo(...poly[i]);
                }
                shape.lineTo(...poly[0]);
                const geometry = new THREE.ExtrudeGeometry(shape, { depth: printConfig.value.depth });
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const mesh = new THREE.Mesh(geometry, material);
                const text = obj.parse(mesh);
                zip.file(`${name}.obj`, text);
            }
            const blob = await zip.generateAsync({ type: 'blob' });
            downloadBlob(blob);
            return;
        }
    }
}
