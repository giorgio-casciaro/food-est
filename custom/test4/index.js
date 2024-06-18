"use strict";
// const text = (value: string, ...args: Uint32Array[]): Uint32Array => {
//     let valueIndex = TEXTS[value];
//     if (valueIndex === undefined) {
//         valueIndex = TEXTS_ARRAY.length;
//         TEXTS_ARRAY.push(value);
//         TEXTS[value] = valueIndex;
//     }
//     return new Uint32Array([TYPES.text, valueIndex]);
// };
// const attr = (name: string, value: string): Uint32Array => {
//     let nameIndex = ATTR[name];
//     if (nameIndex === undefined) {
//         nameIndex = ATTR_ARRAY.length;
//         ATTR_ARRAY.push(name);
//         ATTR[name] = nameIndex;
//     }
//     let valueIndex = ATTR[value];
//     if (valueIndex === undefined) {
//         valueIndex = ATTR_ARRAY.length;
//         ATTR_ARRAY.push(value);
//         ATTR[value] = valueIndex;
//     }
//     return new Uint32Array([TYPES.attr, nameIndex, valueIndex]);
// };
// const style = (name: string, value: string): Uint32Array => {
//     let nameIndex = STYLES[name];
//     if (nameIndex === undefined) {
//         nameIndex = STYLE_ARRAY.length;
//         STYLE_ARRAY.push(name);
//         STYLES[name] = nameIndex;
//     }
//     let valueIndex = STYLES[value];
//     if (valueIndex === undefined) {
//         valueIndex = STYLE_ARRAY.length;
//         STYLE_ARRAY.push(value);
//         STYLES[value] = valueIndex;
//     }
//     return new Uint32Array([TYPES.style, nameIndex, valueIndex]);
// };
// const on = (name: string, value: Function): Uint32Array => {
//     let nameIndex = EVENTS[name];
//     if (nameIndex === undefined) {
//         nameIndex = EVENT_ARRAY.length;
//         EVENT_ARRAY.push(name);
//         EVENTS[name] = nameIndex;
//     }
//     let valueIndex = EVENTS[value.toString()];
//     if (valueIndex === undefined) {
//         valueIndex = EVENT_ARRAY.length;
//         EVENT_ARRAY.push(value.toString());
//         EVENTS[value.toString()] = valueIndex;
//     }
//     return new Uint32Array([TYPES.event, nameIndex, valueIndex]);
// };
// const element = (tag: string, ...args: Uint32Array[]): Uint32Array => {
//     let tagIndex = TAG[tag];
//     if (tagIndex === undefined) {
//         tagIndex = TAG_ARRAY.length;
//         TAG_ARRAY.push(tag);
//         TAG[tag] = tagIndex;
//     }
//     // Calculate the total length needed for the combined array
//     let totalLength = 2; // for TYPES.element and tagIndex
//     for (let i = 0; i < args.length; i++) {
//         totalLength += args[i].length;
//     }
//     // Allocate the combined array
//     let combinedArray = new Uint32Array(totalLength);
//     // Set the initial values
//     combinedArray[0] = TYPES.element;
//     combinedArray[1] = tagIndex;
//     // Append each argument to the combined array
//     let offset = 2;
//     for (let i = 0; i < args.length; i++) {
//         combinedArray.set(args[i], offset);
//         offset += args[i].length;
//     }
//     return combinedArray;
// };
// const label = (label: string): Uint32Array => {
//     let labelIndex = LABEL[label];
//     if (labelIndex === undefined) {
//         labelIndex = LABEL_ARRAY.length;
//         LABEL_ARRAY.push(label);
//         LABEL[label] = labelIndex;
//     }
//     return new Uint32Array([TYPES.label, labelIndex]);
// };
// const TYPES = {
//     element: 0,
//     text: 1,
//     label: 2,
//     attr: 3,
//     style: 4,
//     event: 5,
// };
// const TAG_ARRAY: string[] = [];
// const TAG: Record<string, number> = {};
// const ATTR_ARRAY: string[] = [];
// const ATTR: Record<string, number> = {};
// const TEXTS_ARRAY: string[] = [];
// const TEXTS: Record<string, number> = {};
// const LABEL_ARRAY: string[] = [];
// const LABEL: Record<string, number> = {};
// const STYLE_ARRAY: string[] = [];
// const STYLES: Record<string, number> = {};
// const EVENT_ARRAY: string[] = [];
// const EVENTS: Record<string, number> = {};
// interface HtmlElementState {
//     tag: string;
//     label: null | string;
//     args: Record<string, string>;
//     events: Record<string, () => void>;
//     styles: Record<string, string>;
//     children: Array<HtmlElementState | HtmlElementTextState>;
// }
// interface HtmlElementTextState {
//     type: 'text';
//     value: string;
// }
// const decodeElement = (encodedArray: Uint32Array): HtmlElementState => {
//     const decodeArray = (index: number): [number, HtmlElementState | HtmlElementTextState] => {
//         const type = encodedArray[index];
//         switch (type) {
//             case TYPES.element: {
//                 const tagIndex = encodedArray[index + 1];
//                 const tag = TAG_ARRAY[tagIndex];
//                 let label: string | null = null;
//                 const args: Record<string, string> = {};
//                 const events: Record<string, () => void> = {};
//                 const styles: Record<string, string> = {};
//                 const children: Array<HtmlElementState | HtmlElementTextState> = [];
//                 let i = index + 2;
//                 while (i < encodedArray.length) {
//                     const argType = encodedArray[i];
//                     switch (argType) {
//                         case TYPES.label:
//                             label = LABEL_ARRAY[encodedArray[i + 1]];
//                             i += 2;
//                             break;
//                         case TYPES.attr:
//                             args[ATTR_ARRAY[encodedArray[i + 1]]] = ATTR_ARRAY[encodedArray[i + 2]];
//                             i += 3;
//                             break;
//                         case TYPES.style:
//                             styles[STYLE_ARRAY[encodedArray[i + 1]]] = STYLE_ARRAY[encodedArray[i + 2]];
//                             i += 3;
//                             break;
//                         case TYPES.event:
//                             events[EVENT_ARRAY[encodedArray[i + 1]]] = new Function(EVENT_ARRAY[encodedArray[i + 2]]) as () => void;
//                             i += 3;
//                             break;
//                         case TYPES.text: {
//                             const value = TEXTS_ARRAY[encodedArray[i + 1]];
//                             children.push({ type: 'text', value });
//                             i += 2;
//                             break;
//                         }
//                         case TYPES.element: {
//                             const [newIndex, child] = decodeArray(i);
//                             children.push(child);
//                             i = newIndex;
//                             break;
//                         }
//                         default:
//                             i = encodedArray.length; // Exit loop if unknown type
//                             break;
//                     }
//                 }
//                 return [i, { tag, label, args, events, styles, children }];
//             }
//             case TYPES.text: {
//                 const value = TEXTS_ARRAY[encodedArray[index + 1]];
//                 return [index + 2, { type: 'text', value }];
//             }
//             default:
//                 throw new Error("Unknown type found in encoded array.");
//         }
//     };
//     const [, decodedElement] = decodeArray(0);
//     return decodedElement as HtmlElementState;
// };
// // Example usage
// const el = element(
//     "div",
//     label("container"),
//     attr("id", "mainContainer"),
//     style("display", "flex"),
//     style("flexDirection", "column"),
//     on("mouseover", () => console.log("Mouse over main container")),
//     element(
//         "header",
//         label("header"),
//         attr("class", "headerClass"),
//         style("backgroundColor", "blue"),
//         element("h1", text("Welcome to the Page")),
//         element(
//             "nav",
//             label("navigation"),
//             attr("class", "navClass"),
//             element("ul",
//                 element("li", text("Home")),
//                 element("li", text("About")),
//                 element("li", text("Contact"))
//             )
//         )
//     ),
//     element(
//         "main",
//         label("content"),
//         attr("class", "contentClass"),
//         style("flex", "1"),
//         element("section",
//             label("section1"),
//             element("h2", text("Section 1")),
//             element("p", text("This is the first section."))
//         ),
//         element("section",
//             label("section2"),
//             element("h2", text("Section 2")),
//             element("p", text("This is the second section."))
//         )
//     ),
//     element(
//         "footer",
//         label("footer"),
//         attr("class", "footerClass"),
//         style("backgroundColor", "grey"),
//         text("Footer content goes here")
//     )
// );
// const decodedEl = decodeElement(el);
// console.log(decodedEl);
//# sourceMappingURL=index.js.map