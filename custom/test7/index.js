"use strict";
var Test7;
(function (Test7) {
    var _a, _b;
    const TYPES = { element: 0, text: 1, label: 2, attr: 3, style: 4, event: 5 };
    let createdElementsArray = [];
    let AF = {
        STRINGS_ARRAY: [],
        STRINGS_KEYS: {},
        FUNCTIONS: [],
        ARGS: new Uint32Array(1000),
        ARGS_INDEX: 0,
        ELEMENTS: [],
        ELEMENTS_INDEX: 0,
        init: function () {
            AF.STRINGS_ARRAY = [];
            AF.STRINGS_KEYS = {};
            AF.FUNCTIONS = [];
            AF.ARGS = new Uint32Array(1000);
            AF.ARGS_INDEX = 0;
            AF.ELEMENTS = [];
            AF.ELEMENTS_INDEX = 0;
        },
        getIndex: (value) => {
            // let index = AF.STRINGS_KEYS[value];
            // if (index === undefined) {
            //     index = AF.STRINGS_ARRAY.length;
            //     AF.STRINGS_ARRAY.push(value);
            //     AF.STRINGS_KEYS[value] = index;
            // }
            // return index;
            AF.STRINGS_ARRAY.push(value);
            return AF.STRINGS_ARRAY.length;
        },
        text: function (value) {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.text;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(value);
            AF.ARGS_INDEX += 2;
            return AF.ARGS_INDEX - 2;
        },
        label: function (label) {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.label;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(label);
            AF.ARGS_INDEX += 2;
            return AF.ARGS_INDEX - 2;
        },
        attr: function (name, value) {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.attr;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.getIndex(value);
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3;
        },
        style: function (name, value) {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.style;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.getIndex(value);
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3;
        },
        on: function (name, value) {
            const valueIndex = AF.FUNCTIONS.length;
            AF.FUNCTIONS.push(value);
            AF.ARGS[AF.ARGS_INDEX] = TYPES.event;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = valueIndex;
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3;
        },
        element: function () {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.element;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(arguments[0]);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.ELEMENTS_INDEX;
            AF.ELEMENTS[AF.ELEMENTS_INDEX] = arguments;
            AF.ELEMENTS_INDEX += 1;
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3;
        },
    };
    const testUint32Array = () => {
        AF.init();
        const createdElement = testTemplate(AF.element, AF.label, AF.attr, AF.style, AF.on, AF.text);
        createdElementsArray.push(createdElement);
    };
    let createdElementsArray2 = [];
    let AF2 = {
        STRINGS_ARRAY: [],
        // STRINGS_KEYS: new Map<string, number>(),
        FUNCTIONS: [],
        // ARGS: new Uint32Array(1000),
        ARGS_INDEX: 0,
        ELEMENTS: [],
        ELEMENTS_INDEX: 0,
        init: function () {
            AF2.STRINGS_ARRAY = [];
            // AF2.STRINGS_KEYS = new Map<string, number>();
            AF2.FUNCTIONS = [];
            // AF2.ARGS = new Uint32Array(1000)
            AF2.ARGS_INDEX = 0;
            if (!AF2.ELEMENTS.length) {
                AF2.ELEMENTS = new Array(100);
                for (let i = 0; i < 100; i++) {
                    AF2.ELEMENTS[i] = new Uint32Array(100);
                }
            }
            AF2.ELEMENTS_INDEX = 0;
        },
        getIndex: (value) => {
            AF2.STRINGS_ARRAY.push(value);
            return AF2.STRINGS_ARRAY.length;
        },
        text: function (value) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.text;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 2;
            return AF2.ARGS_INDEX - 2;
        },
        label: function (label) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.label;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(label);
            AF2.ARGS_INDEX += 2;
        },
        attr: function (name, value) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.attr;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 3;
        },
        style: function (name, value) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.style;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 3;
        },
        on: function (name, value) {
            const valueIndex = AF.FUNCTIONS.length;
            AF.FUNCTIONS.push(value);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.event;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = valueIndex;
            AF2.ARGS_INDEX += 3;
        },
        element: function () {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.element;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(arguments[0]);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.ELEMENTS_INDEX;
            AF2.ELEMENTS_INDEX += 1;
            AF2.ARGS_INDEX = 0;
        },
    };
    const testUint32Array2 = () => {
        AF2.init();
        const createdElement = testTemplate(AF2.element, AF2.label, AF2.attr, AF2.style, AF2.on, AF2.text);
        createdElementsArray2.push(AF2.ELEMENTS);
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
        console.log("testUint32Array STRINGS_ARRAY", AF.STRINGS_ARRAY, AF.STRINGS_KEYS, AF.FUNCTIONS);
        createdElementsArray = [];
    });
    (_b = document.getElementById("testUint32Array2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array2, iterations);
        document.getElementById("results").innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array2", createdElementsArray2[0]);
        console.log("testUint32Array2 STRINGS_ARRAY", AF2.STRINGS_ARRAY, AF2.STRINGS_KEYS, AF2.FUNCTIONS);
        createdElementsArray2 = [];
    });
})(Test7 || (Test7 = {}));
//# sourceMappingURL=index.js.map