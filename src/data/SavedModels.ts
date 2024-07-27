import { ref, watch } from 'vue';

type PolygonPoints = [number, number][][];

export const savedModels = ref<PolygonPoints>();

function slidingWindows<T>(inputArray: T[], size: number) {
    return Array.from({ length: inputArray.length - (size - 1) }, (_, index) => inputArray.slice(index, index + size));
}

export function saveObjects(polys: PolygonPoints) {
    const savedPolys = [];
    for (const poly of polys) {
        const centroid = poly.reduce((a, c) => [a[0] + c[0], a[1] + c[1]]).map((pos) => pos / poly.length);
        const sideLengths = slidingWindows(poly.concat([poly[0]]), 2).map(([a, b]) =>
            Math.hypot(a[0] - b[0], a[1] - b[1])
        );
        const maxSideLengthIndex = sideLengths.indexOf(Math.max(...sideLengths));
        const centeredPoly = poly.map((point) => [point[0] - centroid[0], point[1] - centroid[1]]);
        const angle = -Math.atan2(
            centeredPoly[maxSideLengthIndex][1] - centeredPoly[(maxSideLengthIndex + 1) % poly.length][1],
            centeredPoly[maxSideLengthIndex][0] - centeredPoly[(maxSideLengthIndex + 1) % poly.length][0]
        );
        const rotatedPoly = centeredPoly.map((point) => [
            point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
            point[0] * Math.sin(angle) + point[1] * Math.cos(angle),
        ]);
        savedPolys.push(<[number, number][]>rotatedPoly);
        savedModels.value = savedPolys;
    }
}
