import cv from 'opencv-ts';

export function findObjects() {
    const img = cv.imread('findObjectSrc');

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

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    let glassContour = null;

    for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimiter = cv.arcLength(contour, true);
        const approxPoly = new cv.Mat();
        cv.approxPolyDP(contour, approxPoly, 0.02 * perimiter, true);
        if (approxPoly.size().height === 4) {
            if (!glassContour || cv.contourArea(glassContour) < cv.contourArea(approxPoly)) {
                glassContour = approxPoly.clone();
            }
        }
    }

    const points = [];
    for (let j = 0; j < glassContour?.data32S.length!; j += 2) {
        let point = new cv.Point(glassContour?.data32S[j]!, glassContour?.data32S[j + 1]!);
        // cv.circle(img, point, 20, new cv.Scalar(1, 1, 1, 1), 10);
        points.push(point);
    }
    // cv.imshow('hey', img);

    return points;
}

export default findObjects;
