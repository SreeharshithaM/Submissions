// import * as math from './Modules/Math.js';
// import { stringLength, toUpperCase } from './Modules/String.js';

const { useState } = require("react");

// console.log("Uppercase:" , toUpperCase("Hello World!!"));
// console.log("Add 5 + 3 =", math.add(5,3));

const App = () => {
    var props = {className: "redH1"};
    var props1 = {className: "blueH1"};

    const{showPopup1, updatePopup1} = useState(false);
    const{showPopup2, updatePopup2} = useState(false);

    const [usePopup, updatePopup] = useState(false);
}