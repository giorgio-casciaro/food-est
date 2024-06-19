"use strict";
var Test5;
(function (Test5) {
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
    let objFunctions = {
        text: (value) => {
            return (obj) => {
                obj.children.push({ type: 'text', value });
            };
        },
        label: (label) => {
            return (obj) => {
                obj.label = label;
            };
        },
        attr: (name, value) => {
            return (obj) => {
                obj.attrs[name] = value;
            };
        },
        style: (name, value) => {
            return (obj) => {
                obj.styles[name] = value;
            };
        },
        on: (name, value) => {
            return (obj) => {
                obj.events[name] = value;
            };
        },
        element: (tag, ...args) => {
            const tagIndex = getIndex(tag);
            return (obj) => {
                let thisObj = {
                    tag: tag,
                    label: null,
                    attrs: {},
                    events: {},
                    styles: {},
                    children: []
                };
                for (let i = 0; i < args.length; i++) {
                    args[i](thisObj);
                }
                obj.children.push(thisObj);
            };
        },
    };
    const runTest = (testFunction, iterations) => {
        const start = performance.now();
        for (let i = 0; i < iterations; i++)
            testFunction();
        return performance.now() - start;
    };
    let createdElementsArray = [];
    let createdElementsObj = [];
    // Test functions using a unified template
    const testTemplate = (element, label, attr, style, on, text) => {
        return element("div", label("container"), attr("id", "mainContainer"), style("display", "flex"), style("flexDirection", "column"), on("mouseover", () => console.log("Mouse over main container")), element("header", label("header"), attr("class", "headerClass"), style("backgroundColor", "blue"), element("h1", text("Welcome to the Page")), element("nav", label("navigation"), attr("class", "navClass"), element("ul", element("li", text("Home")), element("li", text("About")), element("li", text("Contact"))))), element("main", label("content"), attr("class", "contentClass"), style("flex", "1"), element("section", label("section1"), element("h2", text("Section 1")), element("p", text("This is the first section."))), element("section", label("section2"), element("h2", text("Section 2")), element("p", text("This is the second section.")))), element("footer", label("footer"), attr("class", "footerClass"), style("backgroundColor", "grey"), text("Footer content goes here")));
    };
    const testUint32Array = () => {
        const createdElement = testTemplate(element, label, attr, style, on, text);
        const arr = new Uint32Array(200); // Adjust size as needed for complexity
        createdElement(arr, 0);
        createdElementsArray.push(arr);
    };
    const testObjects = () => {
        const createdElement = testTemplate(objFunctions.element, objFunctions.label, objFunctions.attr, objFunctions.style, objFunctions.on, objFunctions.text);
        let thisObj = {
            tag: "tag",
            label: null,
            attrs: {},
            events: {},
            styles: {},
            children: []
        };
        createdElement(thisObj);
        createdElementsObj.push(thisObj);
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
})(Test5 || (Test5 = {}));
//# sourceMappingURL=index.js.map