import { handleError } from "./utils.js";

export function iteratorExamples(): void {
  try {
    const arr = ["a", "b", "c"];
    console.log("for...in (keys):");
    for (const i in arr) console.log(i);

    console.log("for...of (values):");
    for (const i of arr) console.log(i);

    console.log([... "abcd"]);
    const [first, second, ...rest] = "thiru";
    console.log(first, second, rest);
  } catch (err) {
    handleError("iteratorExamples", err);
  }
}

export function customIteratorExample(): void {
  try {
    function gen(n: number): Iterable<number> {
      return {
        [Symbol.iterator](): Iterator<number> {
          let i = 0;
          return {
            next(): IteratorResult<number> {
              return { done: i > n, value: i++ };
            },
          };
        },
      };
    }
    console.log([...gen(5)]);
  } catch (err) {
    handleError("customIteratorExample", err);
  }
}
