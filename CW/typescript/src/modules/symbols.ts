import { handleError } from "./utils.js";

export function symbolExamples(): void {
    try {
        const s1: symbol = Symbol("thiru");
        const s2: symbol = Symbol("thiru");
        console.log("s1 === s2:", s1 === s2);

        const s3 = s1;
        console.log("s1 === s3:", s1 === s3);

        const js_obj = {
            name: "thiru",
            age: 60,
            [Symbol.toPrimitive](hint: string): string | number {
                if (hint === "string") return "Hint: guess over 50";
                if (hint === "number") return 58;
                return "somewhere between 50 and 60";
            },
        };

        console.log(`${js_obj}`);
        console.log(js_obj + "");
        console.log(+js_obj);
    } catch (err) {
        handleError("symbolExamples", err);
    }
}
