"use strict";
var Test6;
(function (Test6) {
    var _a, _b, _c, _d;
    const TYPES = { element: 0, text: 1, label: 2, attr: 3, style: 4, event: 5 };
    let createdElementsArray = [];
    let arrayFunctions = {
        STRINGS_ARRAY: [],
        STRINGS_KEYS: {},
        // const FUNCTIONS: Record<string, Function> = {};
        FUNCTIONS: [],
        init: function () {
            arrayFunctions.STRINGS_ARRAY = [];
            arrayFunctions.STRINGS_KEYS = {};
            arrayFunctions.FUNCTIONS = [];
        },
        getIndex: (value) => {
            arrayFunctions.STRINGS_ARRAY.push(value);
            return arrayFunctions.STRINGS_ARRAY.length;
            // let index = arrayFunctions.STRINGS_KEYS[value];
            // if (index === undefined) {
            //     index = arrayFunctions.STRINGS_ARRAY.length;
            //     arrayFunctions.STRINGS_ARRAY.push(value);
            //     arrayFunctions.STRINGS_KEYS[value] = index;
            // }
            // return index;
            // return 0
        },
        text: (value) => function (arr, index) {
            // arr.set([TYPES.text, valueIndex], index);
            arr[index] = TYPES.text;
            arr[index + 1] = arrayFunctions.getIndex(value);
            return index + 2;
        },
        label: (label) => function (arr, index) {
            arr[index] = TYPES.label;
            arr[index + 1] = arrayFunctions.getIndex(label);
            // arr.set([TYPES.label, labelIndex], index);
            return index + 2;
        },
        attr: (name, value) => function (arr, index) {
            arr[index] = TYPES.attr;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = arrayFunctions.getIndex(value);
            // arr.set([TYPES.attr, nameIndex, valueIndex], index);
            return index + 3;
        },
        style: (name, value) => function (arr, index) {
            arr[index] = TYPES.style;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = arrayFunctions.getIndex(value);
            // arr.set([TYPES.style, nameIndex, valueIndex], index);
            return index + 3;
        },
        on: (name, value) => function (arr, index) {
            const valueIndex = arrayFunctions.FUNCTIONS.length;
            arrayFunctions.FUNCTIONS.push(value);
            arr[index] = TYPES.event;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = valueIndex;
            // arr.set([TYPES.event, nameIndex, valueIndex], index);
            return index + 3;
        },
        element: (tag, ...args) => function (arr, index) {
            arr[index] = TYPES.element;
            arr[index + 1] = arrayFunctions.getIndex(tag);
            let offset = index + 2;
            const numArgs = args.length;
            for (let i = 0; i < numArgs; i++) {
                offset = args[i](arr, offset);
            }
            return offset;
        },
    };
    const testUint32Array = () => {
        arrayFunctions.init();
        const createdElement = testTemplate(arrayFunctions.element, arrayFunctions.label, arrayFunctions.attr, arrayFunctions.style, arrayFunctions.on, arrayFunctions.text);
        const arr = new Uint32Array(1000); // Adjust size as needed for complexity
        createdElement(arr, 0);
        createdElementsArray.push(arr);
    };
    let createdElementsArray2 = [];
    let arrayFunctions2 = {
        STRINGS_ARRAY: [],
        STRINGS_KEYS: {},
        FUNCTIONS: [],
        ARGS: new Uint32Array(1000),
        ARGS_INDEX: 0,
        ELEMENTS: [],
        ELEMENTS_INDEX: 0,
        init: function () {
            arrayFunctions2.STRINGS_ARRAY = [];
            arrayFunctions2.STRINGS_KEYS = {};
            arrayFunctions2.FUNCTIONS = [];
            arrayFunctions2.ARGS = new Uint32Array(1000);
            arrayFunctions2.ARGS_INDEX = 0;
            arrayFunctions2.ELEMENTS = [];
            arrayFunctions2.ELEMENTS_INDEX = 0;
        },
        getIndex: (value) => {
            // let index = arrayFunctions2.STRINGS_KEYS[value];
            // if (index === undefined) {
            //     index = arrayFunctions2.STRINGS_ARRAY.length;
            //     arrayFunctions2.STRINGS_ARRAY.push(value);
            //     arrayFunctions2.STRINGS_KEYS[value] = index;
            // }
            // return index;
            arrayFunctions2.STRINGS_ARRAY.push(value);
            return arrayFunctions2.STRINGS_ARRAY.length;
        },
        text: function (value) {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.text;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 2;
            return arrayFunctions2.ARGS_INDEX - 2;
        },
        label: function (label) {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.label;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(label);
            arrayFunctions2.ARGS_INDEX += 2;
            return arrayFunctions2.ARGS_INDEX - 2;
        },
        attr: function (name, value) {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.attr;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3;
        },
        style: function (name, value) {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.style;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3;
        },
        on: function (name, value) {
            const valueIndex = arrayFunctions.FUNCTIONS.length;
            arrayFunctions.FUNCTIONS.push(value);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.event;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = valueIndex;
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3;
        },
        element: function () {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.element;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(arguments[0]);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.ELEMENTS_INDEX;
            arrayFunctions2.ELEMENTS[arrayFunctions2.ELEMENTS_INDEX] = arguments;
            arrayFunctions2.ELEMENTS_INDEX += 1;
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3;
        },
    };
    const testUint32Array2 = () => {
        arrayFunctions2.init();
        const createdElement = testTemplate(arrayFunctions2.element, arrayFunctions2.label, arrayFunctions2.attr, arrayFunctions2.style, arrayFunctions2.on, arrayFunctions2.text);
        createdElementsArray2.push(createdElement);
    };
    let createdElementsArray3 = [];
    let arrayFunctions3 = {
        STRINGS_ARRAY: [],
        STRINGS_KEYS: {},
        // const FUNCTIONS: Record<string, Function> = {};
        FUNCTIONS: [],
        init: function () {
            arrayFunctions3.STRINGS_ARRAY = [];
            arrayFunctions3.STRINGS_KEYS = {};
            arrayFunctions3.FUNCTIONS = [];
        },
        getIndex: (value) => {
            arrayFunctions3.STRINGS_ARRAY.push(value);
            return arrayFunctions3.STRINGS_ARRAY.length;
        },
        text: (value) => {
            let valueIndex = arrayFunctions3.getIndex(value);
            return function (arr, index) {
                // arr.set([TYPES.text, valueIndex], index);
                arr[index] = TYPES.text;
                arr[index + 1] = valueIndex;
                return index + 2;
            };
        },
        label: (label) => {
            let valueIndex = arrayFunctions3.getIndex(label);
            return function (arr, index) {
                arr[index] = TYPES.label;
                arr[index + 1] = valueIndex;
                // arr.set([TYPES.label, labelIndex], index);
                return index + 2;
            };
        },
        attr: (name, value) => {
            let nameIndex = arrayFunctions3.getIndex(name);
            let valueIndex = arrayFunctions3.getIndex(value);
            return function (arr, index) {
                arr[index] = TYPES.attr;
                arr[index + 1] = nameIndex;
                arr[index + 2] = valueIndex;
                // arr.set([TYPES.attr, nameIndex, valueIndex], index);
                return index + 3;
            };
        },
        style: (name, value) => {
            let nameIndex = arrayFunctions3.getIndex(name);
            let valueIndex = arrayFunctions3.getIndex(value);
            return function (arr, index) {
                arr[index] = TYPES.style;
                arr[index + 1] = nameIndex;
                arr[index + 2] = valueIndex;
                // arr.set([TYPES.style, nameIndex, valueIndex], index);
                return index + 3;
            };
        },
        on: (name, value) => {
            let nameIndex = arrayFunctions3.getIndex(name);
            const valueIndex = arrayFunctions3.FUNCTIONS.length;
            arrayFunctions3.FUNCTIONS.push(value);
            return function (arr, index) {
                arr[index] = TYPES.event;
                arr[index + 1] = nameIndex;
                arr[index + 2] = valueIndex;
                // arr.set([TYPES.event, nameIndex, valueIndex], index);
                return index + 3;
            };
        },
        element: (tag, ...args) => {
            let tagIndex = arrayFunctions3.getIndex(tag);
            return function (arr, index) {
                arr[index] = TYPES.element;
                arr[index + 1] = tagIndex;
                let offset = index + 2;
                const numArgs = args.length;
                for (let i = 0; i < numArgs; i++) {
                    offset = args[i](arr, offset);
                }
                return offset;
            };
        },
    };
    const testUint32Array3 = () => {
        arrayFunctions3.init();
        const createdElement = testTemplate(arrayFunctions3.element, arrayFunctions3.label, arrayFunctions3.attr, arrayFunctions3.style, arrayFunctions3.on, arrayFunctions3.text);
        const arr = new Uint32Array(1000); // Adjust size as needed for complexity
        createdElement(arr, 0);
        createdElementsArray3.push(arr);
    };
    let createdElementsObj = [];
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
    // Test functions using a unified template
    const testTemplate = (element, label, attr, style, on, text) => {
        return element("div", label("main-container"), attr("id", "mainContainer"), style("display", "flex"), style("flexDirection", "column"), on("mouseover", () => console.log("Mouse over main container")), element("header", label("header"), attr("class", "headerClass"), style("backgroundColor", "blue"), element("h1", text("Welcome to Our News Page")), element("nav", label("navigation"), attr("class", "navClass"), element("ul", element("li", text("Home")), element("li", text("About")), element("li", text("Contact")), element("li", text("Blog"))))), element("main", label("content"), attr("class", "contentClass"), style("flex", "1"), element("section", label("featured-article"), element("h2", text("Featured Article")), element("img", attr("src", "featured-image.jpg"), style("width", "100%")), element("p", text("Summary of the featured article...")), element("a", text("Read more"), attr("href", "#"))), element("section", label("article-list"), element("h2", text("More Articles")), element("article", label("article1"), element("h3", text("Article Title 1")), element("img", attr("src", "image1.jpg"), style("width", "50%")), element("p", text("Summary of article 1...")), element("a", text("Read more"), attr("href", "#article1"))), element("article", label("article2"), element("h3", text("Article Title 2")), element("img", attr("src", "image2.jpg"), style("width", "50%")), element("p", text("Summary of article 2...")), element("a", text("Read more"), attr("href", "#article2")))), element("aside", label("sidebar"), attr("class", "sidebarClass"), style("width", "20%"), element("h3", text("Sidebar")), element("ul", element("li", element("a", text("Link 1"), attr("href", "#link1"))), element("li", element("a", text("Link 2"), attr("href", "#link2")))), element("img", attr("src", "ad.jpg"), style("width", "100%")), element("p", text("Advertisement")))), element("footer", label("footer"), attr("class", "footerClass"), style("backgroundColor", "grey"), text("© 2024 News Site, Inc."), element("ul", element("li", text("Privacy")), element("li", text("Terms of Service")), element("li", text("Contact")))));
    };
    const runTest = (testFunction, iterations) => {
        const start = performance.now();
        for (let i = 0; i < iterations; i++)
            testFunction();
        return performance.now() - start;
    };
    (_a = document.getElementById("testUint32Array")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array, iterations);
        document.getElementById("results").innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array", createdElementsArray[0]);
        console.log("testUint32Array STRINGS_ARRAY", arrayFunctions.STRINGS_ARRAY, arrayFunctions.STRINGS_KEYS, arrayFunctions.FUNCTIONS);
        createdElementsArray = [];
    });
    (_b = document.getElementById("testUint32Array2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array2, iterations);
        document.getElementById("results").innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array2", createdElementsArray2[0]);
        console.log("testUint32Array2 STRINGS_ARRAY", arrayFunctions2.STRINGS_ARRAY, arrayFunctions2.STRINGS_KEYS, arrayFunctions2.FUNCTIONS);
        createdElementsArray2 = [];
    });
    (_c = document.getElementById("testUint32Array3")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array3, iterations);
        document.getElementById("results").innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array3", createdElementsArray3[0]);
        console.log("testUint32Array3 STRINGS_ARRAY", arrayFunctions3.STRINGS_ARRAY, arrayFunctions3.STRINGS_KEYS, arrayFunctions3.FUNCTIONS);
        createdElementsArray3 = [];
    });
    (_d = document.getElementById("testObjects")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testObjects, iterations);
        document.getElementById("results").innerText = `Object test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("createdElementsObj", createdElementsObj[0]);
        createdElementsObj = [];
    });
})(Test6 || (Test6 = {}));
//# sourceMappingURL=index.js.map