import { ref } from 'vue';

type Polygons = { [name: string]: [number, number][] };
type TemplateFiles = { [name: string]: Polygons };

export const templateFiles = ref<TemplateFiles>({ main: {} });
export const openedFileName = ref<string>();

export function fillNames(polys: [number, number][][]) {
    // console.log(polys);
    const polygons: Polygons = {};
    for (const [index, poly] of polys.entries()) {
        polygons[`polygon${index}`] = poly;
    }

    return <[string, Polygons]>[openedFileName.value, polygons];
}

export function stripNames(polys: Polygons) {
    const rawPolys = [];
    for (const name in polys) rawPolys.push(polys[name]);
    return rawPolys;
}

export function saveFile(name: string, file: Polygons) {
    // console.log(name, file);
    templateFiles.value![name] = file;
}
