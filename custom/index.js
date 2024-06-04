import { observable, tag } from './lib.js';

const debugMode = true;

function log(message, ...args) {
    if (debugMode) {
        console.log(message, ...args);
    }
}

function createHTMLElement(props) {
    const element = document.createElement(props.tag);
    for (const [key, value] of Object.entries(props.attributes)) {
        element[key] = value;
    }
    for (const [event, handler] of Object.entries(props.events)) {
        element.addEventListener(event, handler);
    }
    for (const child of props.children) {
        if (child instanceof HtmlElementProps) {
            element.appendChild(createHTMLElement(child));
        } else {
            element.appendChild(document.createTextNode(child));
        }
    }
    return element;
}

function updateHTMLElement(newProps, element) {
    // Update attributes
    for (const [key, value] of Object.entries(newProps.attributes)) {
        if (element[key] !== value) { // Only update if the value has changed
            element[key] = value;
        }
    }

    // Update event listeners - remove old ones and add new ones if needed
    // Assuming event listeners are stored in a way that they can be identified and managed
    if (newProps.events) {
        for (const [event, handler] of Object.entries(newProps.events)) {
            // First remove the old listener to avoid duplicate listeners
            element.removeEventListener(event, element.events ? element.events[event] : null);
            // Then add the new listener
            element.addEventListener(event, handler);
        }
        // Update the events registry in the element for reference
        element.events = newProps.events;
    }

    // Handle children elements (if needed, can be further developed based on requirements)
    if (newProps.children && newProps.children.length !== element.children.length) {
        // Clear existing children
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        // Append new children
        for (const child of newProps.children) {
            if (child instanceof HtmlElementProps) {
                element.appendChild(createHTMLElement(child));
            } else if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(child));
            }
        }
    }
}


function TestComponent() {
    log('TestComponent rendered');
    const state = observable({ list: [{ name: "1" }, { name: "2" }], name: "taskManager", showLoading: true, showLoading2: true });

    /**
     * @return {HtmlElementProps} The generated element.
     */
    function generate() {
        let root = tag("div");
        if (state.showLoading) {
            root.attributes.textContent = "LOADING";
        } else {
            root.attributes.textContent = state.name;
        }
        return root;
    }

    let htmlElement = createHTMLElement(generate());

    // state.$onSet(["list"], () => {
    //     log('TestComponent state list changed');
    //     // Update list elements here if needed
    // });

    state.$onSet(["showLoading"], () => {
        log('TestComponent showLoading changed',state.showLoading);
        let updatedHtmlElementProps = generate();
        updateHTMLElement(updatedHtmlElementProps, htmlElement);
    });
    setTimeout(() => state.showLoading = false, 2000);
    return htmlElement;
}

document.body.appendChild(TestComponent());
