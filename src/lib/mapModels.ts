import { repairConfig } from '@/data/RepairConfig';
import { cross } from './utils';
import cv from 'opencv-ts';
import { toRaw } from 'vue';

export function mapModels(template: [number, number][][], brokenModels: [number, number][][]) {
    const templateCopy = structuredClone(toRaw(template));
    const brokenModelsCopy = structuredClone(toRaw(brokenModels));
    const mappedModels: [[number, number][], [number, number][], number][] = [];
    while (templateCopy.length && brokenModelsCopy.length) {
        let crossPoly = cross(templateCopy, brokenModelsCopy);
        const matchedPolys = crossPoly.map((pair, index) => {
            const templ = pair[0];
            const broken = pair[1];
            const templIndex = ~~(index / broken.length);
            const brokenIndex = index % broken.length;

            const templContour = cv.matFromArray(1, templ.length, cv.CV_32SC2, templ.flat());
            const brokenContour = cv.matFromArray(1, broken.length, cv.CV_32SC2, broken.flat());

            return [
                templIndex,
                brokenIndex,
                cv.matchShapes(templContour, brokenContour, repairConfig.value.huMomentsCoefficient, 0),
            ];
        });
        const [templIndex, brokenIndex, similarity] = matchedPolys.sort(([, , a], [, , b]) => a - b)[0];
        mappedModels.push([templateCopy[templIndex], brokenModelsCopy[brokenIndex], similarity]);
        templateCopy.splice(templIndex, 1);
        brokenModelsCopy.splice(brokenIndex, 1);
    }
    console.log(mappedModels);
    return mappedModels;
}
