
export function findCommon1(arr1: string, arr2: string): string;
export function findCommon1<T>(arr1: T[], arr2: T[]): T[];


export function findCommon1(arr1: any, arr2: any): any {
  try {
    // --- Case 1: String comparison (case-insensitive) ---
    if (typeof arr1 === "string" && typeof arr2 === "string") {
      const v1 = arr1.toLowerCase().split("");
      const v2 = arr2.toLowerCase().split("");

      const result = new Set<string>();
      for (let i = 0; i < v1.length; i++) {
        for (let j = 0; j < v2.length; j++) {
          if (v1[i] === v2[j]) {
            result.add(v1[i]);
            break;
          }
        }
      }

      // Return unique common characters as string
      return Array.from(result).join("");
    }

    // --- Case 2: Array comparison (supports nested arrays) ---
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
      // Flatten nested arrays safely
      function flattenArray(arr: any[]): any[] {
        return arr.reduce(
          (acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val),
          []
        );
      }

      const v1 = flattenArray(arr1);
      const v2 = flattenArray(arr2);
      const result = new Set<any>();

      for (let i = 0; i < v1.length; i++) {
        for (let j = 0; j < v2.length; j++) {
          if (v1[i] === v2[j]) {
            result.add(v1[i]);
            break;
          }
        }
      }

      // Return unique common values as array
      return Array.from(result);
    }

    throw new Error("Unsupported input types for findCommon1()");
  } catch (err: any) {
    console.error("Error in findCommon1:", err.message);
    return [];
  }
}
