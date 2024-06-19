"use strict";
var _a, _b;
const TYPES = { element: 0, text: 1, label: 2, attr: 3, style: 4, event: 5 };
const STRINGS_ARRAY = [], STRINGS_KEYS = {};
// const FUNCTIONS: Record<string, Function> = {};
const FUNCTIONS = [];
const getIndex = (value) => {
    let index = STRINGS_KEYS[value];
    if (index === undefined) {
        index = STRINGS_ARRAY.length;
        STRINGS_ARRAY.push(value);
        STRINGS_KEYS[value] = index;
    }
    return index;
};
const text = (value) => {
    const valueIndex = getIndex(value);
    return (arr, index) => {
        // arr.set([TYPES.text, valueIndex], index);
        arr[index] = TYPES.text;
        arr[index + 1] = valueIndex;
        return index + 2;
    };
};
const label = (label) => {
    const labelIndex = getIndex(label);
    return function (arr, index) {
        arr[index] = TYPES.label;
        arr[index + 1] = labelIndex;
        // arr.set([TYPES.label, labelIndex], index);
        return index + 2;
    };
};
const attr = (name, value) => {
    const nameIndex = getIndex(name);
    const valueIndex = getIndex(value);
    return function (arr, index) {
        arr[index] = TYPES.attr;
        arr[index + 1] = nameIndex;
        arr[index + 2] = valueIndex;
        // arr.set([TYPES.attr, nameIndex, valueIndex], index);
        return index + 3;
    };
};
const style = (name, value) => {
    const nameIndex = getIndex(name);
    const valueIndex = getIndex(value);
    return function (arr, index) {
        arr[index] = TYPES.style;
        arr[index + 1] = nameIndex;
        arr[index + 2] = valueIndex;
        // arr.set([TYPES.style, nameIndex, valueIndex], index);
        return index + 3;
    };
};
const on = (name, value) => {
    const nameIndex = getIndex(name);
    const valueIndex = FUNCTIONS.length;
    FUNCTIONS.push(value);
    return function (arr, index) {
        arr[index] = TYPES.event;
        arr[index + 1] = nameIndex;
        arr[index + 2] = valueIndex;
        // arr.set([TYPES.event, nameIndex, valueIndex], index);
        return index + 3;
    };
};
const element = (tag, ...args) => {
    const tagIndex = getIndex(tag);
    return function (arr, index) {
        arr[index] = TYPES.element;
        arr[index + 1] = tagIndex;
        let offset = index + 2;
        for (let i = 0; i < args.length; i++) {
            offset = args[i](arr, offset);
        }
        return offset;
    };
};
const textObj = (value) => ({ type: 'text', value });
const attrObj = (name, value) => ({ [name]: value });
const styleObj = (name, value) => ({ [name]: value });
const onObj = (name, value) => ({ [name]: value });
const elementObj = (tag, ...args) => {
    const attrs = {}, events = {}, styles = {};
    let label = null;
    const children = [];
    args.forEach(arg => {
        if (arg === null)
            return;
        if (arg.type === 'text')
            children.push(arg);
        else if (arg.tag)
            children.push(arg);
        else {
            const record = arg;
            for (const key in record) {
                if (record[key] instanceof Function)
                    events[key] = record[key];
                else if (key === 'label')
                    label = record[key];
                else
                    attrs[key] = record[key];
            }
        }
    });
    return { tag, label, attrs, styles, events, children };
};
const runTest = (testFunction, iterations) => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++)
        testFunction();
    return performance.now() - start;
};
let createdElementsArray = [];
let createdElementsObj = [];
const createComplexElement = (depth, branches) => {
    const createElement = (currentDepth) => {
        if (currentDepth > depth)
            return (arr, index) => index;
        const children = [];
        for (let i = 0; i < branches; i++) {
            children.push(createElement(currentDepth + 1));
        }
        const tag = currentDepth === depth ? "p" : "div";
        const textContent = `Content at depth ${currentDepth}`;
        return element(tag, label(`depth-${currentDepth}`), attr("class", `depth-${currentDepth}-class`), style("padding", `${currentDepth * 10}px`), style("margin", `${currentDepth * 5}px`), on("click", () => {
            console.log(`Long code ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
        }), text(textContent), ...children);
    };
    return createElement(1);
};
const createComplexElementObj = (depth, branches) => {
    const createElement = (currentDepth) => {
        if (currentDepth > depth)
            return null;
        const children = [];
        for (let i = 0; i < branches; i++) {
            const child = createElement(currentDepth + 1);
            if (child)
                children.push(child);
        }
        const tag = currentDepth === depth ? "p" : "div";
        const textContent = `Content at depth ${currentDepth}`;
        return elementObj(tag, { label: `depth-${currentDepth}` }, attrObj("class", `depth-${currentDepth}-class`), styleObj("padding", `${currentDepth * 10}px`), styleObj("margin", `${currentDepth * 5}px`), onObj("click", () => {
            console.log(`Long code ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
            console.log(`Clicked depth ${currentDepth}`);
        }), textObj(textContent), ...children);
    };
    return createElement(1);
};
const testUint32Array = () => {
    const createdElement = createComplexElement(5, 3);
    const arr = new Uint32Array(3000); // Adjust size as needed for complexity
    createdElement(arr, 0);
    createdElementsArray.push(arr);
};
const testObjects = () => {
    const createdElement = createComplexElementObj(5, 3);
    createdElementsObj.push(createdElement);
};
(_a = document.getElementById("testUint32Array")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const iterations = 10000;
    const time = runTest(testUint32Array, iterations);
    document.getElementById("results").innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
    console.log("createdElementsArray", createdElementsArray[0]);
    createdElementsArray = [];
});
(_b = document.getElementById("testObjects")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const iterations = 10000;
    const time = runTest(testObjects, iterations);
    document.getElementById("results").innerText = `Object test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
    console.log("createdElementsObj", createdElementsObj[0]);
    createdElementsObj = [];
});
//# sourceMappingURL=index.js.map