import { handleError } from './utils.js';

export function iteratorExamples() {
    try {
        let arr = ['a', 'b', 'c'];
        console.log("for...in (keys):");
        for (let i in arr) console.log(i);

        console.log("for...of (values):");
        for (let i of arr) console.log(i);

        console.log([... "abcd"]);
        const [first, second, ...rest] = "thiru";
        console.log(first, second, rest);
    } catch (err) {
        handleError("iteratorExamples", err);
    }
}

export function customIteratorExample() {
    try {
        function gen(n) {
            return {
                [Symbol.iterator]() {
                    let i = 0;
                    return {
                        next() {
                            return { done: (i > n), value: i++ };
                        }
                    };
                }
            };
        }
        console.log([...gen(5)]);
    } catch (err) {
        handleError("customIteratorExample", err);
    }
}