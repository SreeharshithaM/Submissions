import { sayHello, dollarFunction, blockExample } from './modules/functions.js';
import { Jedi, Sith, oopsExample } from './modules/oops.js';
import { arrayExamples } from './modules/arrays_maps_sets.js';
import { iteratorExamples, customIteratorExample } from './modules/iterators.js';
import { basicGenerator, flattenGenerator } from './modules/generators.js';
import { asyncSumExample } from './modules/async_examples.js';
import { destructuringExample } from './modules/destructuring.js';
import { symbolExamples } from './modules/symbols.js';


// 🔹 Helper to format section headers
function printSection(title) {
    const line = "=".repeat(50);
    console.log(`\n${line}\n🔹 ${title}\n${line}`);
}

console.log("=== 🚀 JavaScript Modular Playground Started ===");

try {
    // 1️⃣ Functions
    printSection("FUNCTIONS MODULE");
    sayHello("Thiru");
    dollarFunction();
    blockExample();

    // 2️⃣ Iterators
    printSection("ITERATORS MODULE");
    iteratorExamples();
    customIteratorExample();

    // 3️⃣ Arrays, Maps, Sets
    printSection("ARRAYS / MAPS / SETS MODULE");
    arrayExamples();

    // 4️⃣ Symbols
    printSection("SYMBOLS MODULE");
    symbolExamples();

    // 5️⃣ OOP (Jedi / Sith)
    printSection("OOPS MODULE");
    oopsExample();
    const yoda = new Jedi();
    const vader = new Sith();
    console.log("Direct Class Test:");
    console.log(`${yoda}`);
    console.log(`${vader}`);

    // 6️⃣ Generators
    printSection("GENERATORS MODULE");
    basicGenerator();
    flattenGenerator();

    // 7️⃣ Async
    printSection("ASYNC / AWAIT MODULE");
    await asyncSumExample();

    // 8️⃣ Destructuring
    printSection("DESTRUCTURING MODULE");
    destructuringExample();

    
} catch (err) {
    console.error("🔥 [index.js] Fatal Error:", err.message);
}

console.log("\n=== ✅ Execution Completed ===");