import { handleError } from './utils.js';

export class Jedi {
    constructor() {
        this.forceIsDark = false;
    }

    toString() {
        return (this.forceIsDark ? "Join" : "Fear is the path to") + " the dark side.";
    }
}

export class Sith extends Jedi {
    constructor() {
        super();
        this.forceIsDark = true;
    }
}

export function oopsExample() {
    try {
        const j = new Jedi();
        const s = new Sith();

        console.log(`${j}`);
        console.log(`${s}`);
        console.log("s instanceof Jedi:", s instanceof Jedi);
        console.log("j instanceof Sith:", j instanceof Sith);
    } catch (err) {
        handleError("oopsExample", err);
    }
}