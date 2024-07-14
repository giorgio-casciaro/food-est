namespace Test8 {
    interface HtmlElementState {
        tag: string;
        label: null | string;
        attrs: Record<string, string>;
        events: Record<string, () => void>;
        styles: Record<string, string>;
        children: Array<HtmlElementState | HtmlElementTextState>;
    }
    interface FastHtmlElementState {
        tag: string;
        label: null | string;
        attrs: { [key: string]: any } | null,
        children: Array<FastHtmlElementState | HtmlElementTextState>;
    }

    interface HtmlElementTextState {
        type: 'text';
        value: string;
    }

    const TYPES = { element: 0, text: 1, label: 2, attr: 3, style: 4, event: 5 };

    type Uint32ArrayModifier = (arr: Uint32Array, index: number) => number;
    type ObjModifier = (obj: HtmlElementState) => void;

    let createdElementsArray: Array<number>[] = [];
    let AF = {
        STRINGS_ARRAY: [] as Array<string>,
        STRINGS_KEYS: {} as Record<string, number>,
        FUNCTIONS: [] as Array<Function>,
        ARGS: new Uint32Array(1000),
        ARGS_INDEX: 0,
        ELEMENTS: [] as Array<IArguments>,
        ELEMENTS_INDEX: 0,
        init: function () {
            AF.STRINGS_ARRAY = []
            AF.STRINGS_KEYS = {}
            AF.FUNCTIONS = []
            AF.ARGS = new Uint32Array(1000)
            AF.ARGS_INDEX = 0
            AF.ELEMENTS = []
            AF.ELEMENTS_INDEX = 0
        },
        getIndex: (value: string): number => {
            AF.STRINGS_ARRAY.push(value);
            return AF.STRINGS_ARRAY.length
        },
        text: function (value: string): number {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.text;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(value);
            AF.ARGS_INDEX += 2;
            return AF.ARGS_INDEX - 2
        },
        label: function (label: string): number {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.label;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(label);
            AF.ARGS_INDEX += 2;
            return AF.ARGS_INDEX - 2
        },
        attr: function (name: string, value: string): number {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.attr;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.getIndex(value);
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3
        },
        style: function (name: string, value: string): number {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.style;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.getIndex(value);
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3
        },
        on: function (name: string, value: Function): number {
            const valueIndex = AF.FUNCTIONS.length;
            AF.FUNCTIONS.push(value);
            AF.ARGS[AF.ARGS_INDEX] = TYPES.event;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(name);
            AF.ARGS[AF.ARGS_INDEX + 2] = valueIndex;
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3
        },
        element: function (): number {
            AF.ARGS[AF.ARGS_INDEX] = TYPES.element;
            AF.ARGS[AF.ARGS_INDEX + 1] = AF.getIndex(arguments[0] as string);
            AF.ARGS[AF.ARGS_INDEX + 2] = AF.ELEMENTS_INDEX;
            AF.ELEMENTS[AF.ELEMENTS_INDEX] = arguments;
            AF.ELEMENTS_INDEX += 1;
            AF.ARGS_INDEX += 3;
            return AF.ARGS_INDEX - 3
        },
    }
    
    const testUint32Array = () => {
        AF.init();
        const createdElement = testTemplate(AF.element, AF.label, AF.attr, AF.style, AF.on, AF.text);
        createdElementsArray.push(createdElement);
    };

    let createdElementsArray2: Array<any>[] = [];
    let AF2 = {
        STRINGS_ARRAY: [] as Array<string>,
        FUNCTIONS: [] as Array<Function>,
        ARGS_INDEX: 0,
        ELEMENTS: [] as Array<Uint32Array>,
        ELEMENTS_INDEX: 0,
        init: function () {
            AF2.STRINGS_ARRAY = [];
            AF2.FUNCTIONS = [];
            AF2.ARGS_INDEX = 0;
            if(!AF2.ELEMENTS.length){
                AF2.ELEMENTS = new Array(100);
                for (let i = 0; i < 100; i++) {
                    AF2.ELEMENTS[i] = new Uint32Array(100);
                }
            }
            AF2.ELEMENTS_INDEX = 0;
        },
        getIndex: (value: string): number => {
            AF2.STRINGS_ARRAY.push(value);
            return AF2.STRINGS_ARRAY.length;
        },
        text: function (value: string): number {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.text;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 2;
            return AF2.ARGS_INDEX - 2;
        },
        label: function (label: string) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.label;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(label);
            AF2.ARGS_INDEX += 2;
        },
        attr: function (name: string, value: string) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.attr;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 3;
        },
        style: function (name: string, value: string) {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.style;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.getIndex(value);
            AF2.ARGS_INDEX += 3;
        },
        on: function (name: string, value: Function) {
            const valueIndex = AF.FUNCTIONS.length;
            AF.FUNCTIONS.push(value);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.event;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(name);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = valueIndex;
            AF2.ARGS_INDEX += 3;
        },
        element: function () {
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX] = TYPES.element;
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 1] = AF2.getIndex(arguments[0] as string);
            AF2.ELEMENTS[AF2.ELEMENTS_INDEX][AF2.ARGS_INDEX + 2] = AF2.ELEMENTS_INDEX;
            AF2.ELEMENTS_INDEX += 1;
            AF2.ARGS_INDEX = 0;
        },
    }
    
    const testUint32Array2 = () => {
        AF2.init();
        const createdElement = testTemplate(AF2.element, AF2.label, AF2.attr, AF2.style, AF2.on, AF2.text);
        createdElementsArray2.push(AF2.ELEMENTS);
    };

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

    const testTemplateObj = (element: Function, text: Function) => {
        return element("div", "main-container", {
            id: "mainContainer",
            style: { display: "flex", flexDirection: "column" },
            onmouseover: () => console.log("Mouse over main container")
        }, [
            element("header", "header", {
                class: "headerClass",
                style: { backgroundColor: "blue" }
            }, [
                element("h1", null, null, [text("Welcome to Our News Page")]),
                element("nav", "navigation", {
                    class: "navClass"
                }, [
                    element("ul", null, null, [
                        element("li", null, null, [text("Home")]),
                        element("li", null, null, [text("About")]),
                        element("li", null, null, [text("Contact")]),
                        element("li", null, null, [text("Blog")])
                    ])
                ])
            ]),
            element("main", "content", {
                class: "contentClass",
                style: { flex: "1" }
            }, [
                element("section", "featured-article", null, [
                    element("h2", null, null, [text("Featured Article")]),
                    element("img", null, {
                        src: "featured-image.jpg",
                        style: { width: "100%" }
                    }, []),
                    element("p", null, null, [text("Summary of the featured article...")]),
                    element("a", null, { href: "#" }, [text("Read more")])
                ]),
                element("section", "article-list", null, [
                    element("h2", null, null, [text("More Articles")]),
                    element("article", "article1", null, [
                        element("h3", null, null, [text("Article Title 1")]),
                        element("img", null, {
                            src: "image1.jpg",
                            style: { width: "50%" }
                        }, []),
                        element("p", null, null, [text("Summary of article 1...")]),
                        element("a", null, { href: "#article1" }, [text("Read more")])
                    ]),
                    element("article", "article2", null, [
                        element("h3", null, null, [text("Article Title 2")]),
                        element("img", null, {
                            src: "image2.jpg",
                            style: { width: "50%" }
                        }, []),
                        element("p", null, null, [text("Summary of article 2...")]),
                        element("a", null, { href: "#article2" }, [text("Read more")])
                    ])
                ]),
                element("aside", "sidebar", {
                    class: "sidebarClass",
                    style: { width: "20%" }
                }, [
                    element("h3", null, null, [text("Sidebar")]),
                    element("ul", null, null, [
                        element("li", null, null, [
                            element("a", null, { href: "#link1" }, [text("Link 1")])
                        ]),
                        element("li", null, null, [
                            element("a", null, { href: "#link2" }, [text("Link 2")])
                        ])
                    ]),
                    element("img", null, {
                        src: "ad.jpg",
                        style: { width: "100%" }
                    }, []),
                    element("p", null, null, [text("Advertisement")])
                ])
            ]),
            element("footer", "footer", {
                class: "footerClass",
                style: { backgroundColor: "grey" }
            }, [
                text("© 2024 News Site, Inc."),
                element("ul", null, null, [
                    element("li", null, null, [text("Privacy")]),
                    element("li", null, null, [text("Terms of Service")]),
                    element("li", null, null, [text("Contact")])
                ])
            ])
        ]);
    };

    
    let createdElementsArray3: Array<any>[] = [];
    const testObjectTemplate = () => {
        const element = (
            tag: string,
            label: string | null,
            attrs: { [key: string]: any } | null,
            children: Array<FastHtmlElementState | HtmlElementTextState>
        ):FastHtmlElementState => {
            const el: FastHtmlElementState = {
                tag: tag,
                label: label,
                attrs: attrs,
                children: children
            };
        
            // if (attrs) {
            //     for (const key in attrs) {
            //         if (key.startsWith("on")) {
            //             el.events[key.substring(2)] = attrs[key];
            //         } else if (key === "style") {
            //             el.styles = Object.assign({}, attrs.style);
            //         } else {
            //             el.attrs[key] = attrs[key];
            //         }
            //     }
            // }
        
            // if (children) {
            //     for (const child of children) {
            //         if (typeof child === "string") {
            //             el.children.push({ type: "text", value: child } as HtmlElementTextState);
            //         } else {
            //             el.children.push(child);
            //         }
            //     }
            // }
        
            // return el;
            return el
        };
        
        const text = (value: string) => {
            return { type: "text", value: value } as HtmlElementTextState;
        };

        
        const createdElement = testTemplateObj(element, text);
        createdElementsArray3.push(createdElement);
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
        console.log("testUint32Array", createdElementsArray[0]);
        console.log("testUint32Array STRINGS_ARRAY", AF.STRINGS_ARRAY, AF.STRINGS_KEYS, AF.FUNCTIONS);
        createdElementsArray = [];
    });

    document.getElementById("testUint32Array2")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testUint32Array2, iterations);
        document.getElementById("results")!.innerText = `Uint32Array test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array2", createdElementsArray2[0]);
        console.log("testUint32Array2 STRINGS_ARRAY", AF2.STRINGS_ARRAY, AF2.FUNCTIONS);
        createdElementsArray2 = [];
    });

    document.getElementById("testObjectTemplate")?.addEventListener("click", () => {
        const iterations = 10000;
        const time = runTest(testObjectTemplate, iterations);
        document.getElementById("results")!.innerText = `Object Template test completed in ${time.toFixed(2)}ms for ${iterations} iterations.`;
        console.log("testUint32Array3", createdElementsArray3[0]);
        createdElementsArray3 = [];
    });
}
