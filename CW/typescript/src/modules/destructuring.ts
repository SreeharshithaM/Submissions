import { handleError } from "./utils.js";

export function destructuringExample(): void {
  try {
    const a = { x: 3, y: 4 };
    const { x, y: z } = a;
    console.log("Destructured:", x, z);

    const [p, q = 3] = [1, undefined];
    console.log(p, q);

    const [r = 4, s = r] = [];
    console.log(r, s);
  } catch (err) {
    handleError("destructuringExample", err);
  }
}
