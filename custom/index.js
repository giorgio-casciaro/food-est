/**
 * @file index.js
 * @description This file contains the implementation of a simple UI component system using observable state and HTML element generation functions.
 * @version 0.0.1
 */

import {  observable, tag, createHTMLElement, updateHTMLElement } from './lib.js';

function TestComponentChild(htmlElementProps) {
    console.log('TestComponent rendered');

    /**
     * @return {HtmlElementProps} The generated element.
     */
    function generate() {
        return tag("div")._child("test")._child(htmlElementProps.params.name)._children(htmlElementProps.children);
    }

    let htmlElement = createHTMLElement(generate());
    return htmlElement;
}


function TestComponent(params) {
    console.log('TestComponent rendered');
    const state = observable({ list: [{ name: "1" }, { name: "2" }], name: "taskManager", showLoading: true, showLoading2: true });

    /**
     * @return {HtmlElementProps} The generated element.
     */
    function generate() {
        return tag("div")
        ._child(tag("h2")._text(state.showLoading ? "LOADING" : state.name))
        ._child(tag(TestComponentChild)._params({ name: "test" })._text(state.showLoading ? "LOADING" : state.name));
    }
    var htmlElementProps = generate()
    let htmlElement = createHTMLElement(htmlElementProps);

    // state.$onSet(["list"], () => {
    //     console.log('TestComponent state list changed');
    //     // Update list elements here if needed
    // });

    state.$onSet(["showLoading"], () => {
        console.log('TestComponent showLoading changed',state.showLoading);
        let updatedHtmlElementProps = generate();
        updateHTMLElement(htmlElementProps, updatedHtmlElementProps, htmlElement);
    });
    setTimeout(() => state.showLoading = false, 2000);
    return htmlElement;
}

document.body.appendChild(TestComponent());
