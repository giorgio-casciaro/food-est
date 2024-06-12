/**
 * @file HtmlElementProps.js
 * @description This file contains commonly used utility functions and types for the Food Est project.
 * It includes functions for creating HTML elements, handling observables, and defining types for HTML element props.
 * @version 0.0.1
 */

/**
 * Base class for managing HTML element properties including attributes, events, and children.
 */
class ElementProps {
    /**
     * Constructs an instance of ElementProps.
     * @param {Object} attributes - HTML attributes as key-value pairs.
     * @param {Object} events - Event listeners as key-function pairs.
     * @param {string|Function|null} label - Label or function returning a label based on properties.
     */
    constructor(attributes = {}, events = {}, slots = {}, label = null) {
        this.attributes = attributes;
        this.events = events;
        this.label = label;
    }

    /**
     * Sets the label for the element.
     * @param {string|Function} label - The label or function returning a label.
     * @returns {ElementProps} This instance for chaining.
     */
    setLabel(label) {
        this.label = label;
        return this;
    }

    /**
     * Retrieves a label string based on the current properties.
     * @param {Object} props - Properties object, used if label is a function.
     * @returns {string} The label or result of the label function.
     */
    getLabelString(props) {
        return typeof this.label === 'function' ? this.label(props) : this.label;
    }

    /**
     * Sets a single attribute.
     * @param {string} name - The attribute name.
     * @param {string} value - The attribute value.
     * @returns {ElementProps} This instance for chaining.
     */
    setAttr(name, value) {
        this.attributes[name] = value;
        return this;
    }

    /**
     * Sets multiple attributes.
     * @param {Object} attributes - Attributes to set.
     * @returns {ElementProps} This instance for chaining.
     */
    setAttrs(attributes) {
        this.attributes = { ...this.attributes, ...attributes };
        return this;
    }

    /**
     * Sets a single event handler.
     * @param {string} name - The event name.
     * @param {Function} listener - The event listener function.
     * @returns {ElementProps} This instance for chaining.
     */
    setEvent(name, listener) {
        this.events[name] = listener;
        return this;
    }

    /**
     * Sets multiple event handlers.
     * @param {Object} events - Events to set.
     * @returns {ElementProps} This instance for chaining.
     */
    setEvents(events) {
        this.events = { ...this.events, ...events };
        return this;
    }

    /**
     * Adds a child element.
     * @param {ElementProps|string} child - The child element or text to add.
     * @returns {ElementProps} This instance for chaining.
     */
    addChild(child) {
        this.children.push(child);
        return this;
    }

    /**
     * Sets multiple children.
     * @param {Array<ElementProps|string>} children - The children elements or texts to set.
     * @returns {ElementProps} This instance for chaining.
     */
    setChildren(children) {
        this.children = [...this.children, ...children];
        return this;
    }

    /**
     * Sets the text content of the element, replacing any existing children.
     * @param {string} text - The text content to set.
     * @returns {ElementProps} This instance for chaining.
     */
    setText(text) {
        this.children = [text];
        return this;
    }

    /**
     * Sets a single style.
     * @param {string} name - The style property name.
     * @param {string} value - The style value.
     * @returns {ElementProps} This instance for chaining.
     */
    setStyle(name, value) {
        this.style[name] = value;
        return this;
    }

    /**
     * Sets multiple styles.
     * @param {Object} styles - Styles to set.
     * @returns {ElementProps} This instance for chaining.
     */
    setStyles(styles) {
        this.style = { ...this.style, ...styles };
        return this;
    }
}

/**
 * Extends ElementProps for components, allowing component-specific handling.
 */
class ComponentHtmlElementProps extends ElementProps {
    /**
     * Constructs an instance of ComponentHtmlElementProps.
     * @param {Function} component - Component function that creates an element.
     * @param {Object} params - Additional parameters for advanced configurations.
     * @param {Object} attributes - HTML attributes as key-value pairs.
     * @param {Object} events - Event listeners as key-function pairs.
     * @param {Array} children - Child elements or text nodes.
     * @param {string|Function|null} label - Label or function returning a label based on properties.
     */
    constructor(component, params = {}, attributes = {}, events = {},  label = null) {
        super(attributes, events, children, label);
        this.component = component;
        this.params = params;
    }

    /**
     * Sets a parameter for the component.
     * @param {string} name - The parameter name.
     * @param {*} value - The parameter value.
     * @returns {ComponentHtmlElementProps} This instance for chaining.
     */
    setParam(name, value) {
        this.params[name] = value;
        return this;
    }

    /**
     * Sets multiple parameters for the component.
     * @param {Object} params - Parameters to set.
     * @returns {ComponentHtmlElementProps} This instance for chaining.
     */
    setParams(params) {
        this.params = { ...this.params, ...params };
        return this;
    }

    /**
     * Creates an HTML element based on the defined component.
     * @returns {HTMLElement} The created HTML element.
     */
    createElement() {
        return this.component(this);
    }
}

/**
 * Extends ElementProps for basic HTML elements, allowing tag-specific handling.
 */
class HtmlElementProps extends ElementProps {
    /**
     * Constructs an instance of HtmlElementProps.
     * @param {string} tag - The HTML tag to create.
     * @param {Object} attributes - HTML attributes as key-value pairs.
     * @param {Object} events - Event listeners as key-function pairs.
     * @param {Array} children - Child elements or text nodes.
     * @param {string|Function|null} label - Label or function returning a label based on properties.
     */
    constructor(tag, attributes = {}, events = {}, children = [], label = null) {
        super(attributes, events,  label);
        this.tag = tag;
        this.children = children;
    }   

    /**
     * Creates an HTML element based on the tag.
     * @returns {HTMLElement} The created HTML element.
     */
    createElement() {
        return document.createElement(this.tag);
    }
}

/**
 * Creates a new HtmlElementProps instance for a given tag.
 * @param {string} tag - The HTML tag to create.
 * @param {Object} attributes - HTML attributes as key-value pairs.
 * @param {Object} events - Event listeners as key-function pairs.
 * @param {Array} children - Child elements or text nodes.
 * @param {string|Function|null} label - Label or function returning a label based on properties.
 * @returns {HtmlElementProps} The new instance.
 */
export function tag(tag, attributes = {}, events = {}, children = [], label = null) {
    return new HtmlElementProps(tag, attributes, events, children, label);
}

/**
 * Creates a new ComponentHtmlElementProps instance for a given component.
 * @param {Function} component - Component function that creates an element.
 * @param {Object} params - Additional parameters specific to the component.
 * @param {Object} attributes - HTML attributes as key-value pairs.
 * @param {Object} events - Event listeners as key-function pairs.
 * @param {Array} children - Child elements or text nodes.
 * @param {string|Function|null} label - Label or function returning a label based on properties.
 * @returns {ComponentHtmlElementProps} The new instance.
 */
export function component(component, params = {}, attributes = {}, events = {}, children = [], label = null) {
    return new ComponentHtmlElementProps(component, params, attributes, events, children, label);
}

/**
 * Creates and configures an HTML element based on provided properties and optionally manages labeled elements.
 * @param {ElementProps} props - Properties defining the element.
 * @param {Object} labeledElements - Optional object to store elements with labels.
 * @returns {HTMLElement} The created and configured HTML element.
 */
export function createHTMLElement(props, labeledElements = {}) {
    const element = props.createElement();
    for (const [key, value] of Object.entries(props.attributes)) {
        element.setAttribute(key, value);
    }
    for (const [key, value] of Object.entries(props.style)) {
        element.style[key] = value; // Apply each style property to the element.
    }
    for (const [event, handler] of Object.entries(props.events)) {
        element.addEventListener(event, handler);
    }
    if (props instanceof HtmlElementProps) {
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