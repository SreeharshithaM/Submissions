import { handleError } from './utils.js';

export function sayHello(name) {
    try {
        if (name != null) console.log("Hello " + name);
        else throw new Error("Name cannot be null");
    } catch (err) {
        handleError("sayHello", err);
    }
}

export function dollarFunction() {
    try {
        function $() {
            this.name = "Thiru";
            console.log("Inside $ function");
        }

        var b = function () {
            console.log("b function of $");
        };

        $.b = b;
        $.b();
    } catch (err) {
        handleError("dollarFunction", err);
    }
}

export function blockExample() {
    try {
        function block() {
            function foo() {
                console.log(x);
            }
            foo(); // Will throw ReferenceError
            let x = 3;
            foo();
        }
        block();
    } catch (err) {
        handleError("blockExample", err);
    }
}