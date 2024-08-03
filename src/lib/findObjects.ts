import cv, { type Mat } from 'opencv-ts';

type PointArr = [number, number][];
const epsilon = 0.015;
const minArea = 50;

export function detectEdges(img: Mat): Mat {
    const cannyCoeff = 0.33;

    const grayImg = new cv.Mat();
    cv.cvtColor(img, grayImg, cv.COLOR_BGR2GRAY);
    const jsArr = [...grayImg.data].sort((a, b) => a - b);
    const median = jsArr[~~(jsArr.length / 2)];

    const morphCross = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(5, 5), new cv.Point(-1, -1));
    const loThreshold = ~~Math.max(0, (1 - cannyCoeff) * median);
    const hiThreshold = ~~Math.min(255, (1 + cannyCoeff) * median);

    const edges = new cv.Mat();
    cv.Canny(grayImg, edges, loThreshold, hiThreshold);
    cv.dilate(edges, edges, morphCross);
    grayImg.delete();
    morphCross.delete();
    return edges;
}

export function findBiggestRectangle(edges: Mat): Mat | null {
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    let biggestRectangle = null;

    for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimiter = cv.arcLength(contour, true);
        const approxPoly = new cv.Mat();
        cv.approxPolyDP(contour, approxPoly, epsilon * perimiter, true);
        if (approxPoly.size().height === 4) {
            if (!biggestRectangle || cv.contourArea(biggestRectangle) < cv.contourArea(approxPoly)) {
                biggestRectangle = approxPoly.clone();
            }
        }
        contour.delete();
        approxPoly.delete();
    }
    contours.delete();
    hierarchy.delete();

    return biggestRectangle;
}

export function getPoints(contour: Mat, debug: boolean = false, debugImg: Mat | null = null): PointArr {
    const points: PointArr = [];
    for (let j = 0; j < contour?.data32S.length!; j += 2) {
        let point = <[number, number]>[contour?.data32S[j]!, contour?.data32S[j + 1]];
        if (debug) cv.circle(debugImg!, new cv.Point(point[0], point[1]), 20, new cv.Scalar(1, 1, 1, 1), 10);
        points.push(point);
    }

    return points;
}

export function sortRectanglePoints(points: PointArr): PointArr {
    const pointSum = points.map((point) => point[0] + point[1]);
    const pointDiff = points.map((point) => Math.abs(point[0] - point[1]));

    const topLeft = points[pointSum.indexOf(Math.min(...pointSum))];
    const topRight = points[pointDiff.indexOf(Math.min(...pointDiff))];
    const bottomLeft = points[pointDiff.indexOf(Math.max(...pointDiff))];
    const bottomRight = points[pointSum.indexOf(Math.max(...pointSum))];

    return [topLeft, topRight, bottomRight, bottomLeft];
}

export function getSortedRectPoints(contour: Mat, debug: boolean = false, debugImg: Mat | null = null): PointArr {
    return sortRectanglePoints(getPoints(contour, debug, debugImg));
}

export function clockwiseSquareMat(size: number): Mat {
    return cv.matFromArray(1, 4, cv.CV_32FC2, [0, 0, 0, size, size, size, size, 0]);
}

export function cropToPoints(img: Mat, points: PointArr, size: number): Mat {
    const pointsMat = cv.matFromArray(1, 4, cv.CV_32FC2, points.flat(2));
    const croppedPts = clockwiseSquareMat(size);
    const croppedMatrix = cv.getPerspectiveTransform(pointsMat, croppedPts);
    const cropped = new cv.Mat();
    cv.warpPerspective(
        img,
        cropped,
        croppedMatrix,
        new cv.Size(225, 225),
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar()
    );
    pointsMat.delete();
    croppedPts.delete();
    croppedMatrix.delete();
    return cropped;
}

export function sortPointsCW(points: PointArr): PointArr {
    const centroid = points.reduce((a, c) => [a[0] + c[0], a[1] + c[1]]).map((pos) => pos / points.length);
    const centeredPoints = points.map((point) => <[number, number]>[point[0] - centroid[0], point[1] - centroid[1]]);
    const sortedCenteredPoints = centeredPoints.sort((a, b) => {
        const phi = Math.atan2(a[1], a[0]);
        const psi = Math.atan2(b[1], b[0]);
        return phi - psi;
    });
    return sortedCenteredPoints.map((point) => [point[0] + centroid[0], point[1] + centroid[1]]);
}

export function sortPointsCCW(points: PointArr): PointArr {
    const centroid = points.reduce((a, c) => [a[0] + c[0], a[1] + c[1]]).map((pos) => pos / points.length);
    const centeredPoints = points.map((point) => <[number, number]>[point[0] - centroid[0], point[1] - centroid[1]]);
    const sortedCenteredPoints = centeredPoints.sort((a, b) => {
        const phi = Math.atan2(a[1], a[0]);
        const psi = Math.atan2(b[1], b[0]);
        return psi - phi;
    });
    return sortedCenteredPoints.map((point) => [point[0] + centroid[0], point[1] + centroid[1]]);
}

export function detectObjects(img: Mat, debug: boolean = false, debugImg: Mat | null = null): PointArr[] {
    const binary = new cv.Mat();
    cv.threshold(img, binary, 150, 255, cv.THRESH_BINARY);
    const edges = detectEdges(binary);
    const contours = new cv.MatVector(),
        hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    if (debug) {
        cv.drawContours(debugImg!, contours, -1, new cv.Scalar(128));
    }
    hierarchy.delete();
    const shapes = [];
    for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimiter = cv.arcLength(contour, true);
        const approxPoly = new cv.Mat();
        cv.approxPolyDP(contour, approxPoly, epsilon * perimiter, true);
        const points = sortPointsCW(getPoints(approxPoly, true, debugImg));
        if (cv.contourArea(approxPoly) < minArea) continue;
        shapes.push(points);
        contour.delete();
        approxPoly.delete();
    }
    cleanup(binary, edges);
    return shapes;
}

export function cleanPolys(polys: [number, number][][]) {
    function slidingWindows<T>(inputArray: T[], size: number) {
        return Array.from({ length: inputArray.length - (size - 1) }, (_, index) =>
            inputArray.slice(index, index + size)
        );
    }

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
        if (poly.length > 2) savedPolys.push(<[number, number][]>rotatedPoly);
    }
    return savedPolys;
}

export function cleanup(...mats: Mat[]) {
    for (const mat of mats) mat.delete();
}

export function findObjects(src: string | HTMLImageElement | HTMLCanvasElement = 'findObjectSrc') {
    const img = cv.imread(src);
    const edges = detectEdges(img);
    const scanPlateContour = findBiggestRectangle(edges);
    const orderedPoints = getSortedRectPoints(scanPlateContour!);

    const imgSize = 225;
    const scanPlate = cropToPoints(img, orderedPoints, imgSize);
    const buildObjects = detectObjects(scanPlate, true, scanPlate);
    // cv.imshow('hey', scanPlate);
    console.log(buildObjects);

    cleanup(img, edges, scanPlateContour!, scanPlate);
    return cleanPolys(buildObjects);
}

export default findObjects;
