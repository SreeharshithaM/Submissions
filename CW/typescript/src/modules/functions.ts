import { handleError } from "./utils.js";

export function sayHello(name: string | null): void {
  try {
    if (name != null) console.log("Hello " + name);
    else throw new Error("Name cannot be null");
  } catch (err) {
    handleError("sayHello", err);
  }
}

export function dollarFunction(): void {
  try {
    function $(): void {
      console.log("Inside $ function");
    }
    const b = (): void => console.log("b function of $");
    ($ as any).b = b;
    ($ as any).b();
  } catch (err) {
    handleError("dollarFunction", err);
  }
}

export function blockExample(): void {
  try {
    function block(): void {
      function foo(): void {
        // Will throw because x is used before initialization
        console.log((x as any));
      }
      foo();
      let x = 3;
      foo();
    }
    block();
  } catch (err) {
    handleError("blockExample", err);
  }
}
