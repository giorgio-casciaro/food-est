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
    return function(arr: Uint32Array, index: number): number{
        arr[index] = TYPES.label;
        arr[index + 1] = labelIndex;
        // arr.set([TYPES.label, labelIndex], index);
        return index + 2;
    };
};

const attr = (name: string, value: string): Uint32ArrayModifier => {
    const nameIndex = getIndex(name);
    const valueIndex = getIndex(value);
    return function(arr: Uint32Array, index: number): number{
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
    return function(arr: Uint32Array, index: number): number{
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
    return function(arr: Uint32Array, index: number): number {
        arr[index] = TYPES.event;
        arr[index + 1] = nameIndex;
        arr[index + 2] = valueIndex;
        // arr.set([TYPES.event, nameIndex, valueIndex], index);
        return index + 3;
    };
};

const element = (tag: string, ...args: Uint32ArrayModifier[]): Uint32ArrayModifier => {
    const tagIndex = getIndex(tag);
    return function(arr: Uint32Array, index: number): number{
        arr[index] = TYPES.element;
        arr[index + 1] = tagIndex;
        let offset = index + 2;
        for (let i = 0; i < args.length; i++) {
            offset = args[i](arr, offset);
        }
        return offset;
    };
};

const textObj = (value: string): HtmlElementTextState => ({ type: 'text', value });
const attrObj = (name: string, value: string): Record<string, string> => ({ [name]: value });
const styleObj = (name: string, value: string): Record<string, string> => ({ [name]: value });
const onObj = (name: string, value: () => void): Record<string, () => void> => ({ [name]: value });

const elementObj = (tag: string, ...args: Array<HtmlElementState | HtmlElementTextState | Record<string, string> | Record<string, () => void> | null>): HtmlElementState => {
    const attrs: Record<string, string> = {}, events: Record<string, () => void> = {}, styles: Record<string, string> = {};
    let label: string | null = null;
    const children: Array<HtmlElementState | HtmlElementTextState> = [];
    args.forEach(arg => {
        if (arg === null) return;
        if ((arg as HtmlElementTextState).type === 'text') children.push(arg as HtmlElementTextState);
        else if ((arg as HtmlElementState).tag) children.push(arg as HtmlElementState);
        else {
            const record = arg as Record<string, any>;
            for (const key in record) {
                if (record[key] instanceof Function) events[key] = record[key];
                else if (key === 'label') label = record[key];
                else attrs[key] = record[key];
            }
        }
    });
    return { tag, label, attrs, styles, events, children };
};

const runTest = (testFunction: () => void, iterations: number): number => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) testFunction();
    return performance.now() - start;
};

let createdElementsArray: Uint32Array[] = [];
let createdElementsObj: object[] = [];
const createComplexElement = (depth: number, branches: number): Uint32ArrayModifier => {
    const createElement = (currentDepth: number): Uint32ArrayModifier => {
        if (currentDepth > depth) return (arr: Uint32Array, index: number) => index;

        const children: Uint32ArrayModifier[] = [];
        for (let i = 0; i < branches; i++) {
            children.push(createElement(currentDepth + 1));
        }

        const tag = currentDepth === depth ? "p" : "div";
        const textContent = `Content at depth ${currentDepth}`;
        return element(
            tag,
            label(`depth-${currentDepth}`),
            attr("class", `depth-${currentDepth}-class`),
            style("padding", `${currentDepth * 10}px`),
            style("margin", `${currentDepth * 5}px`),
            on("click", () =>{
                console.log(`Long code ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
            }),
            text(textContent),
            ...children
        );
    };

    return createElement(1);
};

const createComplexElementObj = (depth: number, branches: number): HtmlElementState => {
    const createElement = (currentDepth: number): HtmlElementState => {
        if (currentDepth > depth) return null;

        const children: Array<HtmlElementState | HtmlElementTextState> = [];
        for (let i = 0; i < branches; i++) {
            const child = createElement(currentDepth + 1);
            if (child) children.push(child);
        }

        const tag = currentDepth === depth ? "p" : "div";
        const textContent = `Content at depth ${currentDepth}`;
        return elementObj(
            tag,
            { label: `depth-${currentDepth}` },
            attrObj("class", `depth-${currentDepth}-class`),
            styleObj("padding", `${currentDepth * 10}px`),
            styleObj("margin", `${currentDepth * 5}px`),
            onObj("click", () => {
                console.log(`Long code ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
                console.log(`Clicked depth ${currentDepth}`)
            }),
            textObj(textContent),
            ...children
        );
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
