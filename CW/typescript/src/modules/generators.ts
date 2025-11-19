import { handleError } from "./utils.js";

export function basicGenerator(): void {
  try {
    function* genFour(): Generator<number> {
      yield 1;
      yield 2;
      yield 3;
      return 4;
    }
    const g = genFour();
    console.log(g.next(), g.next(), g.next(), g.next(), g.next());
  } catch (err) {
    handleError("basicGenerator", err);
  }
}

export function flattenGenerator(): void {
  try {
    function* flatten(array: any[]): Generator<any> {
      for (const x of array) {
        if (Array.isArray(x)) yield* flatten(x);
        else yield x;
      }
    }
    console.log([...flatten([1, [2, 3], 4, [5, 6, [7, 8]]])]);
  } catch (err) {
    handleError("flattenGenerator", err);
  }
}
