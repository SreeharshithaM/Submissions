import { handleError } from './utils.js';

export function arrayExamples() {
    try {
        let arr = [4, 3, 66, 56, 78];
        console.log("Find >10:", arr.find(x => x > 10));

        let map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        console.log("Map size:", map.size);
        console.log("Has c:", map.has('c'));

        map.set('d', 4);
        map.delete('a');

        console.log("Updated Map:", [...map.entries()]);

        let set = new Set([1, 2, 3, 4, 5, 5, 4]);
        set.add(6);
        console.log("Set size:", set.size);
        for (let v of set) console.log(v);
    } catch (err) {
        handleError("arrayExamples", err);
    }
}