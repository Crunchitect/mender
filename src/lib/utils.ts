import { toRaw, isRef, isReactive, isProxy } from 'vue';

export function zip<T extends unknown[][]>(...arr: T): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
    // @ts-expect-error
    return Array(Math.max(...arr.map((a) => a.length)))
        .fill(undefined)
        .map((_, i) => arr.map((a) => a[i]));
}

export function cross<T extends unknown[][]>(...a: T): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
    //@ts-expect-error
    return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e])));
}

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
    const objectIterator = (input: any): any => {
        if (Array.isArray(input)) {
            return input.map((item) => objectIterator(item));
        }
        if (isRef(input) || isReactive(input) || isProxy(input)) {
            return objectIterator(toRaw(input));
        }
        if (input && typeof input === 'object') {
            return Object.keys(input).reduce((acc, key) => {
                acc[key as keyof typeof acc] = objectIterator(input[key]);
                return acc;
            }, {} as T);
        }
        return input;
    };

    return objectIterator(sourceObj);
}
