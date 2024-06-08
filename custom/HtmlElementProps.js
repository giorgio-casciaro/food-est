/**
 * @file HtmlElementProps.js
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
        this.isComponent = typeof tag === 'function';
    }

    setLabel(label) {
        this.label = label;
        return this;
    }
    getLabelString(props) {
        if(typeof this.label === 'function') {
            return this.label(props);
        }
        return this.label;
    }

    setAttr(name, value) {
        this.attributes[name] = value;
        return this;
    }

    setAttrs(attributes) {
        this.attributes = { ...this.attributes, ...attributes };
        return this;
    }

    setEvent(name, listener) {
        this.events[name] = listener;
        return this;
    }

    setEvents(events) {
        this.events = { ...this.events, ...events };
        return this;
    }

    addChild(child) {
        this.children.push(child);
        return this;
    }

    setChildren(children) {
        this.children = [...this.children, ...children];
        return this;
    }

    setText(text) {
        this.children = [text];
        return this;
    }

    setParam(name, value) {
        this.params[name] = value;
        return this;
    }

    setParams(params) {
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
    return new HtmlElementProps(tag, attributes, events, children, label, params);
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
    if (!props.isComponent) {
        for (const child of props.children) {
            if (child instanceof HtmlElementProps) {
                element.appendChild(createHTMLElement(child, labeledElements, false));
            } else {
                element.appendChild(document.createTextNode(child));
            }
        }
    }
    const label = props.getLabelString(props);
    if (label) {
        labeledElements[label] = element;
        element._htmlElementProps = props;
    }

    console.log('createHTMLElement', props, labeledElements, element);
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
    console.log('Updated HTMLElement start', oldProps, newProps, element);
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

    // Update children
    if (!newProps.isComponent) {
        var elementsToAppend = []
        for (const child of newProps.children) {
            if (child instanceof HtmlElementProps) {
                const label = typeof child.label === "function" ? child.label(child) : child.label;
                if (label && labeledElements[label]) {
                    updateHTMLElement(labeledElements[label]._htmlElementProps, child, labeledElements[label], labeledElements);
                    elementsToAppend.push(labeledElements[label]);
                } else {
                    elementsToAppend.push(createHTMLElement(child, labeledElements, false));
                }
            } else {
                elementsToAppend.push(document.createTextNode(child));
            }
        }
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
        element.append(...elementsToAppend);
    } else {
        const paramsChanged = Object.keys(newParams).length !== Object.keys(oldParams).length || Object.keys(newParams).some(key => newParams[key] !== oldParams[key]);
        if (paramsChanged) {
            const newComponent = newProps.tag(newProps);
            element.replaceWith(newComponent);
        }
    }

    // Update the label registry if needed
    const label = props.getLabelString(newProps);
    if (label && element !== labeledElements[label]) {
        labeledElements[label] = element;
        element._htmlElementProps = newProps;
    }

    console.log('Updated HTMLElement', oldProps, newProps, element);
}


function isEqualHtmlElementProps(a, b) {
    if (a.tag !== b.tag || typeof a.tag !== typeof b.tag) return false;
    if (a.isComponent !== b.isComponent) return false;

    if (Object.keys(a.attributes).length !== Object.keys(b.attributes).length) return false;
    for (let key in a.attributes) {
        if (a.attributes[key] !== b.attributes[key]) return false;
    }

    if (Object.keys(a.params).length !== Object.keys(b.params).length) return false;
    for (let key in a.params) {
        if (a.params[key] !== b.params[key]) return false;
    }

    if (a.children.length !== b.children.length) return false;
    for (let i = 0; i < a.children.length; i++) {
        if (typeof a.children[i] === 'object' && typeof b.children[i] === 'object') {
            if (!isEqualHtmlElementProps(a.children[i], b.children[i])) return false;
        } else if (a.children[i] !== b.children[i]) {
            return false;
        }
    }

    if (Object.keys(a.events).length !== Object.keys(b.events).length) return false;
    for (let key in a.events) {
        if (!(key in b.events) || a.events[key] !== b.events[key]) return false;
    }

    return true;
}