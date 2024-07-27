// OpenCV extension that automatically calls clean-up, after out-of-scope.
import cv from 'opencv-ts';

// Polyfills.
// @ts-ignore
Symbol.dispose ??= Symbol('Symbol.dispose');
// @ts-ignore
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

export function GCMat() {
    const mat = new cv.Mat();

    return {
        mat,
        //@ts-ignore
        [Symbol.dispose]: () => {
            console.log('Mat Delete');
            mat.delete();
        },
    };
}

export function GCMatVec() {
    const matvec = new cv.MatVector();

    return {
        matvec,
        //@ts-ignore
        [Symbol.dispose]: () => {
            console.log('MatVec Delete');
            matvec.delete();
        },
    };
}
