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
