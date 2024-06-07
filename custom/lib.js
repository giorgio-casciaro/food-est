/**
 * @file lib.js
 * @description This file contains commonly used utility functions and types for the Food Est project.
 * It includes functions for creating HTML elements, handling observables, and defining types for HTML element props.
 * @version 0.0.1
 */

/**
 * @typedef {Object} HtmlElementProps
 * @property {string|function} [tag='div'] - The tag name of the element to create or the function if it's a component.
 * @property {Object.<string, string>} [attributes={}] - Attributes to set on the element.
 * @property {Object.<string, function>} [events={}] - Events to add to the element.
 * @property {Array.<HtmlElementProps|string>} [children=[]] - Children to append to the element.
 * @property {string|function|null} [label=null] - The tag label to display.
 * @property {Object.<string, any>} [params={}] - Parameters to pass to the component.
 * @property {boolean} isComponent - Indicates if this element is a component.
 */
class HtmlElementProps {
    /**
     * Creates an instance of HtmlElementProps.
     *
     * @param {string|function} [tag='div'] - The tag name of the element to create or the function if it's a component.
     * @param {Object.<string, string>} [attributes={}] - Attributes to set on the element.
     * @param {Object.<string, function>} [events={}] - Events to add to the element.
     * @param {Array.<HtmlElementProps|string>} [children=[]] - Children to append to the element.
     * @param {string|function|null} [label=null] - The tag label to display.
     * @param {Object.<string, any>} [params={}] - Parameters to pass to the component.
     */
    constructor(tag = "div", attributes = {}, events = {}, children = [], label = null, params = {}) {
        this.tag = tag;
        this.attributes = attributes;
        this.events = events;
        this.children = children;
        this.label = label;
        this.params = params;
        this.isComponent = tag instanceof Function;
    }

    _label(label) {
        this.label = label;
        return this;
    }

    _attr(name, value) {
        this.attributes[name] = value;
        return this;
    }

    _attrs(attributes) {
        this.attributes = { ...this.attributes, ...attributes };
        return this;
    }

    _event(name, listener) {
        this.events[name] = listener;
        return this;
    }

    _events(events) {
        this.events = { ...this.events, ...events };
        return this;
    }

    _child(child) {
        this.children.push(child);
        return this;
    }

    _children(children) {
        this.children = [...this.children, ...children];
        return this;
    }

    _text(text) {
        this.children = [text];
        return this;
    }

    _param(name, value) {
        this.params[name] = value;
        return this;
    }

    _params(params) {
        this.params = { ...this.params, ...params };
        return this;
    }
}

/**
 * Creates an instance of HtmlElementProps.
 *
 * @property {string|function} [tag='div'] - The tag name of the element to create or the function if it's a component.
 * @property {Object.<string, string>} [attributes={}] - Attributes to set on the element.
 * @property {Object.<string, function>} [events={}] - Events to add to the element.
 * @property {Array.<HtmlElementProps|string>} [children=[]] - Children to append to the element.
 * @property {string|function|null} [label=null] - The tag label to display.
 * @property {Object.<string, any>} [params={}] - Parameters to pass to the component.
 */
export function tag(tag, attributes = {}, events = {}, children = [], label = null, params = {}) {
    return new HtmlElementProps(tag, attributes, events, children, label);
}


/**
 * Creates an HTML element based on the given props.
 *
 * @param {HtmlElementProps} props - The properties for creating the element.
 * @param {Object.<string, HTMLElement>} [labeledElements={}] - (optional) The labeled elements registry.
 * @param {boolean} [addLabeledElementsToElement=true] - Whether to add labeled elements to the element.
 * @return {HTMLElement} The created HTML element.
 */
export function createHTMLElement(props, labeledElements = {}) {
    const element = props.isComponent ? props.tag(props) : document.createElement(props.tag);
    for (const [key, value] of Object.entries(props.attributes)) {
        element.setAttribute(key, value);
    }
    for (const [event, handler] of Object.entries(props.events)) {
        element.addEventListener(event, handler);
    }
    if(!props.isComponent){
        for (const child of props.children) {
            if (child instanceof HtmlElementProps) {
                element.appendChild(createHTMLElement(child, labeledElements, false));
            } else {
                element.appendChild(document.createTextNode(child));
            }
        }
    }
    if(props.label){labeledElements[props.label] = element;}

    console.log('createHTMLElement ',props,labeledElements,element);
    return element;
}

/**
 * Updates an HTML element with new properties.
 *
 * @param {HtmlElementProps} oldProps - The old properties of the element.
 * @param {HtmlElementProps} newProps - The new properties to update the element with.
 * @param {HTMLElement} element - The HTML element to update.
 * @param {Object.<string, HTMLElement>} [labeledElements={}] - (optional) The labeled elements registry.
 * @return {void} This function does not return anything.
 */
export function updateHTMLElement(oldProps, newProps, element, labeledElements = {}) {
    // Update attributes
    for (const key in oldProps.attributes) {
        if (!(key in newProps.attributes)) {
            element.removeAttribute(key);
        }
    }
    for (const [key, value] of Object.entries(newProps.attributes)) {
        if (element.getAttribute(key) !== value) {
            element.setAttribute(key, value);
        }
    }

    // Update event listeners
    for (const key in oldProps.events) {
        if (!(key in newProps.events)) {
            element.removeEventListener(key, oldProps.events[key]);
        }
    }
    for (const [event, handler] of Object.entries(newProps.events)) {
        if (oldProps.events[event] !== handler) {
            if (oldProps.events[event]) {
                element.removeEventListener(event, oldProps.events[event]);
            }
            element.addEventListener(event, handler);
        }
    }

    // Update component or children
    if (newProps.isComponent) {
        // Check if params have changed
        if (JSON.stringify(oldProps.params) !== JSON.stringify(newProps.params)) {
            const newComponent = newProps.tag(newProps);
            element.replaceWith(newComponent);
            element = newComponent; // Update reference to the new component
        }
    } else {
        // Update children
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        for (const child of newProps.children) {
            if (child instanceof HtmlElementProps) {
                element.appendChild(createHTMLElement(child, labeledElements, false));
            } else {
                element.appendChild(document.createTextNode(child));
            }
        }
    }

    // Update the label registry if needed
    if (newProps.label && element !== labeledElements[newProps.label]) {
        labeledElements[newProps.label] = element;
    }

    console.log('Updated HTMLElement', oldProps, newProps, element);
}

/**
 * Creates an observable object that notifies listeners of changes.
 *
 * @param {Object|Array} data - The data to observe.
 * @returns {Object} An observable object with data and bind method.
 */
export function observable(data, name = "ROOT", parent = null) {
    console.log("observable OBJ", name, typeof data, data)
    const listeners = new Set();

    /**
     * Adds a listener function to be called when a specific property is set.
     *
     * @param {Array} keys - An array of property keys to listen for.
     * @param {Function} listenerFn - The listener function to be called when the property is set.
     * @return {Function} A function to unbind the listener.
     */
    const $onSet = (keys, listenerFn) => {
        const listener = { keys, listenerFn };
        listeners.add(listener);
        listenerFn(); // Initial call to set up
        console.log("proxy", name, "BIND", listeners);
        return () => listeners.delete(listener);
    };

    let updateStarted = false;
    const propsUpdated = new Set();

    function updateUi() {
        console.log("observable updateUi", propsUpdated, listeners, proxy);
        listeners.forEach(listener => {
            let execute = false;
            for (const key of listener.keys) {
                if (propsUpdated.has(key)) {
                    execute = true;
                    break;
                }
            }
            if (execute) listener.listenerFn();
        });
        updateStarted = false;
        propsUpdated.clear();
    }

    const proxy = new Proxy(data, {
        get(target, key) {
            // console.log("proxy", name, "GET", typeof (target[key]), key, target);
            if (key === "$onSet") return $onSet;
            return target[key];
        },
        set(target, key, value) {
            console.log("proxy", name, "SET", typeof (value), key, target, listeners);
            target[key] = value;
            propsUpdated.add(key);
            if (!updateStarted) {
                updateStarted = true;
                requestAnimationFrame(updateUi);
            }
            return true;
        },
    });

    for (const [key, value] of Object.entries(data)) {
        console.log("observable PROP", key, value, typeof data[key]);
        if (typeof data[key] === "object") {
            console.log("observable PROP", key, value);
            data[key] = observable(value, key, proxy);
        }
    }

    return proxy;
}
