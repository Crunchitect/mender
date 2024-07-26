import cv, { type Mat } from 'opencv-ts';

type PointArr = [number, number][];

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
        cv.approxPolyDP(contour, approxPoly, 0.02 * perimiter, true);
        if (approxPoly.size().height === 4) {
            if (!biggestRectangle || cv.contourArea(biggestRectangle) < cv.contourArea(approxPoly)) {
                biggestRectangle = approxPoly.clone();
            }
        }
    }

    return biggestRectangle;
}

export function getRectPoints(contour: Mat, debug: boolean = false, debugImg: Mat | null = null): PointArr {
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
    return sortRectanglePoints(getRectPoints(contour, debug, debugImg));
}

export function clockwiseSquareMat(size: number): Mat {
    return cv.matFromArray(1, 4, cv.CV_32FC2, [0, 0, 0, size, size, size, size, 0]);
}

export function cropToPoints(img: Mat, points: PointArr, size: number): Mat {
    const pointsMat = cv.matFromArray(1, 4, cv.CV_32FC2, points.flat(2));
    const croppedPts = clockwiseSquareMat(size);
    console.log(pointsMat, croppedPts);
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
    return cropped;
}

export function findObjects() {
    const img = cv.imread('findObjectSrc');

    const edges = detectEdges(img);
    const scanPlateContour = findBiggestRectangle(edges);
    const orderedPoints = getSortedRectPoints(scanPlateContour!);

    const imgSize = 225;
    const scanPlate = cropToPoints(img, orderedPoints, imgSize);
    cv.imshow('hey', scanPlate);

    return scanPlate;
}

export default findObjects;
