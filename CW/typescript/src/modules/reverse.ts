import { handleError } from "./utils.js";

export function reverse1(value: string): string;
export function reverse1<T>(value: T[]): T[];
export function reverse1(value: number): number;

export function reverse1(value: any): any {
  try {
    // --- Reverse a string ---
    if (typeof value === "string") {
      const chars = [...value]; // spread is safer than split("")
      let reversed = "";
      for (let i = chars.length - 1; i >= 0; i--) {
        reversed += chars[i];
      }
      return reversed;
    }

    // --- Reverse an array ---
    if (Array.isArray(value)) {
      const copy = [...value];
      const reversed: any[] = [];
      for (let i = copy.length - 1; i >= 0; i--) {
        reversed.push(copy[i]);
      }
      return reversed;
    }

    // --- Reverse a number ---
    if (typeof value === "number") {
      const str = value.toString();
      const digits = [...str];
      let reversedStr = "";
      for (let i = digits.length - 1; i >= 0; i--) {
        reversedStr += digits[i];
      }
      return Number(reversedStr);
    }

    throw new Error(`Unsupported type: ${typeof value}`);
  } catch (err) {
    handleError("oopsExample", err);
  }
}

// ✅ Exported square function
export function square(num: number): number {
  try {
    if (typeof num !== "number" || isNaN(num)) {
      throw new Error("Input must be a valid number");
    }
    return num * num;
  } catch (err: any) {
    console.error("Error in square:", err.message);
    return NaN;
  }
}
