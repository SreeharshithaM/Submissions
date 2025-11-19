import { handleError } from './utils.js';

export function destructuringExample() {
    try {
        let a = { x: 3, y: 4 };
        let { x, y: z } = a;
        console.log("Destructured:", x, z);

        let [p, q = 3] = [1, undefined];
        console.log(p, q);

        let [r = 4, s = r] = [];
        console.log(r, s);
    } catch (err) {
        handleError("destructuringExample", err);
    }
}