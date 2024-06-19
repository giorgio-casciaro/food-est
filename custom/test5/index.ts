namespace Test5 {
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
    const STRINGS_ARRAY: string[] = [], STRINGS_KEYS: Record<string, number> = {};
    // const FUNCTIONS: Record<string, Function> = {};
    const FUNCTIONS: Function[] = [];

    type Uint32ArrayModifier = (arr: Uint32Array, index: number) => number;
    type ObjModifier = (obj: HtmlElementState) => void;

    const getIndex = (value: string): number => {
        let index = STRINGS_KEYS[value];
        if (index === undefined) {
            index = STRINGS_ARRAY.length;
            STRINGS_ARRAY.push(value);
            STRINGS_KEYS[value] = index;
        }
        return index;
    };

    const text = (value: string): Uint32ArrayModifier => {
        const valueIndex = getIndex(value);
        return (arr: Uint32Array, index: number): number => {
            // arr.set([TYPES.text, valueIndex], index);
            arr[index] = TYPES.text;
            arr[index + 1] = valueIndex;
            return index + 2;
        };
    };

    const label = (label: string): Uint32ArrayModifier => {
        const labelIndex = getIndex(label);
        return function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.label;
            arr[index + 1] = labelIndex;
            // arr.set([TYPES.label, labelIndex], index);
            return index + 2;
        };
    };

    const attr = (name: string, value: string): Uint32ArrayModifier => {
        const nameIndex = getIndex(name);
        const valueIndex = getIndex(value);
        return function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.attr;
            arr[index + 1] = nameIndex;
            arr[index + 2] = valueIndex;
            // arr.set([TYPES.attr, nameIndex, valueIndex], index);
            return index + 3;
        };
    };

    const style = (name: string, value: string): Uint32ArrayModifier => {
        const nameIndex = getIndex(name);
        const valueIndex = getIndex(value);
        return function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.style;
            arr[index + 1] = nameIndex;
            arr[index + 2] = valueIndex;
            // arr.set([TYPES.style, nameIndex, valueIndex], index);
            return index + 3;
        };
    };
    const on = (name: string, value: Function): Uint32ArrayModifier => {
        const nameIndex = getIndex(name);
        const valueIndex = FUNCTIONS.length;
        FUNCTIONS.push(value);
        return function (arr: Uint32Array, index: number): number {
            arr[index] = TYPES.event;
            arr[index + 1] = nameIndex;
            arr[index + 2] = valueIndex;
            // arr.set([TYPES.event, nameIndex, valueIndex], index);
            return index + 3;
        };
    };

    const element = (tag: string, ...args: Uint32ArrayModifier[]): Uint32ArrayModifier => {
        const tagIndex = getIndex(tag);
        return function (arr: Uint32Array, index: number): number {
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
            const tagIndex = getIndex(tag);
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

    const runTest = (testFunction: () => void, iterations: number): number => {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) testFunction();
        return performance.now() - start;
    };

    let createdElementsArray: Uint32Array[] = [];
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
            label("container"),
            attr("id", "mainContainer"),
            style("display", "flex"),
            style("flexDirection", "column"),
            on("mouseover", () => console.log("Mouse over main container")),
            element(
                "header",
                label("header"),
                attr("class", "headerClass"),
                style("backgroundColor", "blue"),
                element("h1", text("Welcome to the Page")),
                element(
                    "nav",
                    label("navigation"),
                    attr("class", "navClass"),
                    element("ul",
                        element("li", text("Home")),
                        element("li", text("About")),
                        element("li", text("Contact"))
                    )
                )
            ),
            element(
                "main",
                label("content"),
                attr("class", "contentClass"),
                style("flex", "1"),
                element("section",
                    label("section1"),
                    element("h2", text("Section 1")),
                    element("p", text("This is the first section."))
                ),
                element("section",
                    label("section2"),
                    element("h2", text("Section 2")),
                    element("p", text("This is the second section."))
                )
            ),
            element(
                "footer",
                label("footer"),
                attr("class", "footerClass"),
                style("backgroundColor", "grey"),
                text("Footer content goes here")
            )
        );
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

        } as HtmlElementState
        createdElement(thisObj)
        createdElementsObj.push(thisObj);
    };

    document.getElementById("testUint32Array")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array, iterations);
        document.getElementById("results")!.innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("createdElementsArray", createdElementsArray[0]);
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