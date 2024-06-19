namespace Test6 {
    interface HtmlElementState {
        tag: string;
        label: null | string;
        attrs: Record<string, string>;
        events: Record<string, () => void>;
        styles: Record<string, string>;
        children: Array<HtmlElementState | HtmlElementTextState>;
    }

    interface HtmlElementTextState {
        type: 'text';
        value: string;
    }

    const TYPES = { element: 0, text: 1, label: 2, attr: 3, style: 4, event: 5 };


    type Uint32ArrayModifier = (arr: Uint32Array, index: number) => number;
    type ObjModifier = (obj: HtmlElementState) => void;


    let arrayFunctions = {
        STRINGS_ARRAY: [] as Array<string>,
        STRINGS_KEYS: {} as Record<string, number>,
        // const FUNCTIONS: Record<string, Function> = {};
        FUNCTIONS: [] as Array<Function>,
        init: function () {
            arrayFunctions.STRINGS_ARRAY = []
            arrayFunctions.STRINGS_KEYS = {}
            arrayFunctions.FUNCTIONS = []
        },
        getIndex: (value: string): number => {

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
        text: (value: string): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {
            // arr.set([TYPES.text, valueIndex], index);
            arr[index] = TYPES.text;
            arr[index + 1] = arrayFunctions.getIndex(value);
            return index + 2;
        },

        label: (label: string): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.label;
            arr[index + 1] = arrayFunctions.getIndex(label);
            // arr.set([TYPES.label, labelIndex], index);
            return index + 2;
        },
        attr: (name: string, value: string): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.attr;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = arrayFunctions.getIndex(value);
            // arr.set([TYPES.attr, nameIndex, valueIndex], index);
            return index + 3;
        },
        style: (name: string, value: string): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.style;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = arrayFunctions.getIndex(value);
            // arr.set([TYPES.style, nameIndex, valueIndex], index);
            return index + 3;
        },
        on: (name: string, value: Function): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {
            const valueIndex = arrayFunctions.FUNCTIONS.length;
            arrayFunctions.FUNCTIONS.push(value);
            arr[index] = TYPES.event;
            arr[index + 1] = arrayFunctions.getIndex(name);
            arr[index + 2] = valueIndex;
            // arr.set([TYPES.event, nameIndex, valueIndex], index);
            return index + 3;
        },
        element: (tag: string, ...args: Uint32ArrayModifier[]): Uint32ArrayModifier => function (arr: Uint32Array, index: number): number {

            arr[index] = TYPES.element;
            arr[index + 1] = arrayFunctions.getIndex(tag);
            let offset = index + 2;
            const numArgs = args.length;
            for (let i = 0; i < numArgs; i++) {
                offset = args[i](arr, offset);
            }
            return offset;
        },
    }


    let arrayFunctions2 = {
        STRINGS_ARRAY: [] as Array<string>,
        STRINGS_KEYS: {} as Record<string, number>,
        FUNCTIONS: [] as Array<Function>,
        ARGS: new Uint32Array(1000),
        ARGS_INDEX: 0,
        ELEMENTS: [] as Array<IArguments>,
        ELEMENTS_INDEX: 0,
        init: function () {
            arrayFunctions2.STRINGS_ARRAY = []
            arrayFunctions2.STRINGS_KEYS = {}
            arrayFunctions2.FUNCTIONS = []
            arrayFunctions2.ARGS = new Uint32Array(1000)
            arrayFunctions2.ARGS_INDEX = 0
            arrayFunctions2.ELEMENTS = []
            arrayFunctions2.ELEMENTS_INDEX = 0
        },
        getIndex: (value: string): number => {
            // let index = arrayFunctions2.STRINGS_KEYS[value];
            // if (index === undefined) {
            //     index = arrayFunctions2.STRINGS_ARRAY.length;
            //     arrayFunctions2.STRINGS_ARRAY.push(value);
            //     arrayFunctions2.STRINGS_KEYS[value] = index;
            // }
            // return index;
            arrayFunctions2.STRINGS_ARRAY.push(value);
            return arrayFunctions2.STRINGS_ARRAY.length
        },
        text: function (value: string): number {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.text;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 2;
            return arrayFunctions2.ARGS_INDEX - 2
        },

        label: function (label: string): number {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.label;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(label);
            arrayFunctions2.ARGS_INDEX += 2;
            return arrayFunctions2.ARGS_INDEX - 2
        },
        attr: function (name: string, value: string): number {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.attr;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3
        },
        style: function (name: string, value: string): number {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.style;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.getIndex(value);
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3
        },
        on: function (name: string, value: Function): number {
            const valueIndex = arrayFunctions.FUNCTIONS.length;
            arrayFunctions.FUNCTIONS.push(value);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.event;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(name);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = valueIndex;
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3

        },

        element: function (): number {
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.element;
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(arguments[0] as string);
            arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.ELEMENTS_INDEX;
            arrayFunctions2.ELEMENTS[arrayFunctions2.ELEMENTS_INDEX] = arguments
            arrayFunctions2.ELEMENTS_INDEX += 1;
            arrayFunctions2.ARGS_INDEX += 3;
            return arrayFunctions2.ARGS_INDEX - 3
        },
        // element : function(tag: string, ...args: number[]): number{

        //     arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX] = TYPES.element;
        //     arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 1] = arrayFunctions2.getIndex(tag);
        //     arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + 2] = arrayFunctions2.ELEMENTS_INDEX;
        //     // const numArgs = args.length;
        //     // for (let i = 0; i < numArgs; i++) {
        //     //     arrayFunctions2.ARGS[arrayFunctions2.ARGS_INDEX + i] = arrayFunctions2.getIndex(tag);
        //     // }
        //     arrayFunctions2.ELEMENTS[arrayFunctions2.ELEMENTS_INDEX] = args
        //     arrayFunctions2.ELEMENTS_INDEX  += 1;
        //     arrayFunctions2.ARGS_INDEX += 3;
        //     return arrayFunctions2.ARGS_INDEX - 3
        // },
    }

    let objFunctions = {
        text: (value: string): ObjModifier => {
            return (obj: HtmlElementState): void => {
                obj.children.push({ type: 'text', value })
            };
        },

        label: (label: string): ObjModifier => {
            return (obj: HtmlElementState): void => {
                obj.label = label
            };
        },

        attr: (name: string, value: string): ObjModifier => {
            return (obj: HtmlElementState): void => {
                obj.attrs[name] = value
            };
        },

        style: (name: string, value: string): ObjModifier => {
            return (obj: HtmlElementState): void => {
                obj.styles[name] = value
            };
        },
        on: (name: string, value: () => void): ObjModifier => {
            return (obj: HtmlElementState): void => {
                obj.events[name] = value
            };
        },

        element: (tag: string, ...args: ObjModifier[]): ObjModifier => {
            const tagIndex = arrayFunctions.getIndex(tag);
            return (obj: HtmlElementState): void => {
                let thisObj = {
                    tag: tag,
                    label: null,
                    attrs: {},
                    events: {},
                    styles: {},
                    children: []

                } as HtmlElementState
                for (let i = 0; i < args.length; i++) {
                    args[i](thisObj);
                }
                obj.children.push(thisObj)
            };
        },

    }


    let createdElementsArray: Uint32Array[] = [];
    let createdElementsArray2: Array<number>[] = [];
    let createdElementsObj: object[] = [];


    // Test functions using a unified template
    const testTemplate = (
        element: Function,
        label: Function,
        attr: Function,
        style: Function,
        on: Function,
        text: Function
    ) => {
        return element(
            "div",
            label("main-container"),
            attr("id", "mainContainer"),
            style("display", "flex"),
            style("flexDirection", "column"),
            on("mouseover", () => console.log("Mouse over main container")),
            element(
                "header",
                label("header"),
                attr("class", "headerClass"),
                style("backgroundColor", "blue"),
                element("h1", text("Welcome to Our News Page")),
                element(
                    "nav",
                    label("navigation"),
                    attr("class", "navClass"),
                    element("ul",
                        element("li", text("Home")),
                        element("li", text("About")),
                        element("li", text("Contact")),
                        element("li", text("Blog"))
                    )
                )
            ),
            element(
                "main",
                label("content"),
                attr("class", "contentClass"),
                style("flex", "1"),
                element("section",
                    label("featured-article"),
                    element("h2", text("Featured Article")),
                    element("img", attr("src", "featured-image.jpg"), style("width", "100%")),
                    element("p", text("Summary of the featured article...")),
                    element("a", text("Read more"), attr("href", "#"))
                ),
                element("section",
                    label("article-list"),
                    element("h2", text("More Articles")),
                    element("article",
                        label("article1"),
                        element("h3", text("Article Title 1")),
                        element("img", attr("src", "image1.jpg"), style("width", "50%")),
                        element("p", text("Summary of article 1...")),
                        element("a", text("Read more"), attr("href", "#article1"))
                    ),
                    element("article",
                        label("article2"),
                        element("h3", text("Article Title 2")),
                        element("img", attr("src", "image2.jpg"), style("width", "50%")),
                        element("p", text("Summary of article 2...")),
                        element("a", text("Read more"), attr("href", "#article2"))
                    )
                ),
                element("aside",
                    label("sidebar"),
                    attr("class", "sidebarClass"),
                    style("width", "20%"),
                    element("h3", text("Sidebar")),
                    element("ul",
                        element("li", element("a", text("Link 1"), attr("href", "#link1"))),
                        element("li", element("a", text("Link 2"), attr("href", "#link2")))
                    ),
                    element("img", attr("src", "ad.jpg"), style("width", "100%")),
                    element("p", text("Advertisement"))
                )
            ),
            element(
                "footer",
                label("footer"),
                attr("class", "footerClass"),
                style("backgroundColor", "grey"),
                text("© 2024 News Site, Inc."),
                element("ul",
                    element("li", text("Privacy")),
                    element("li", text("Terms of Service")),
                    element("li", text("Contact"))
                )
            )
        );
    };


    const testUint32Array = () => {

        arrayFunctions.init()
        const createdElement = testTemplate(arrayFunctions.element, arrayFunctions.label, arrayFunctions.attr, arrayFunctions.style, arrayFunctions.on, arrayFunctions.text);

        const arr = new Uint32Array(1000); // Adjust size as needed for complexity
        createdElement(arr, 0);
        createdElementsArray.push(arr);
    };
    const testUint32Array2 = () => {

        arrayFunctions2.init()
        const createdElement = testTemplate(arrayFunctions2.element, arrayFunctions2.label, arrayFunctions2.attr, arrayFunctions2.style, arrayFunctions2.on, arrayFunctions2.text);

        createdElementsArray2.push(createdElement);
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

        } as HtmlElementState
        createdElement(thisObj)
        createdElementsObj.push(thisObj);
    };


    const runTest = (testFunction: () => void, iterations: number): number => {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) testFunction();
        return performance.now() - start;
    };

    document.getElementById("testUint32Array")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array, iterations);
        document.getElementById("results")!.innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("createdElementsArray", createdElementsArray[0]);
        console.log("createdElementsArray STRINGS_ARRAY", arrayFunctions.STRINGS_ARRAY, arrayFunctions.STRINGS_KEYS, arrayFunctions.FUNCTIONS);

        createdElementsArray = [];
    });


    document.getElementById("testUint32Array2")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array2, iterations);
        document.getElementById("results")!.innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("createdElementsArray2", createdElementsArray2[0]);
        console.log("createdElementsArray2 STRINGS_ARRAY", arrayFunctions2.STRINGS_ARRAY, arrayFunctions2.STRINGS_KEYS, arrayFunctions2.FUNCTIONS);

        createdElementsArray = [];
    });

    document.getElementById("testObjects")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testObjects, iterations);
        document.getElementById("results")!.innerText = `Object test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("createdElementsObj", createdElementsObj[0]);
        createdElementsObj = [];
    });
}