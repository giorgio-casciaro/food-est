/**
 * @file HtmlElementProps.js
 * @description This file contains commonly used utility functions and types for the Food Est project.
 * It includes functions for creating HTML elements, handling observables, and defining types for HTML element props.
 * @version 0.0.2
 */

/**
 * @typedef {Object} DocumentFragmentState
 * @property {string|Function|null} [label=null] - Label or function returning a label based on properties.
 */

/**
 * @typedef {Object} HTMLElementState
 * @extends DocumentFragmentState
 * @property {string} tag - The HTML tag.
 * @property {Object<string, string>} attributes - HTML attributes as key-value pairs.
 * @property {Object<string, Function>} events - Event listeners as key-function pairs.
 * @property {Object<string, string>} styles - Styles as key-value pairs.
 */

/**
 * @typedef {Object} ComponentState
 * @extends HTMLElementState
 * @property {Function|null} component - Component function that creates an element.
 * @property {Object<string, *>} parameters - Additional parameters for advanced configurations.
 */


/**
 * @typedef {DocumentFragmentTag|HTMLElementTag|ComponentTag|string|number} AnyTag
 */

/**
 * @class
 * @classdesc Represents a document fragment tag.
 * @property {DocumentFragmentState} state - The current state of the element.
 * @property {DocumentFragmentState|null} oldState - The previous state of the element.
 * @property {DocumentFragment|null} element - The HTML element.
 * @property {Array<AnyTag>} children - The children of the HTML element.
 */
export class DocumentFragmentTag {
    /**
     * Constructs a new DocumentFragmentTag instance.
     */
    constructor() {
        /**
         * @type {DocumentFragmentState|null}
         */
        this.oldState = null;
        
        /**
         * @type {DocumentFragmentState}
         */
        this.state = {
            tag: "div",
        };
        
        /**
         * @type {DocumentFragment|null}
         */
        this.element = null;
        
        /**
         * @type {Array<AnyTag>}
         */
        this.children = [];
    }


    /**
     * Adds a child element.
     * @param {AnyTag} child - The child element or text to add.
     * @returns {DocumentFragmentTag} This instance for chaining.
     */
    addChild(child) {
        this.children.push(child);
        return this;
    }

    /**
     * Sets multiple children.
     * @param {Array<AnyTag>} children - The children elements or texts to set.
     * @returns {DocumentFragmentTag} This instance for chaining.
     */
    setChildren(children) {
        this.children = [...this.children, ...children];
        return this;
    }


    /**
     * Updates the label for the element.
     * @param {string|Function} label - The label or function returning a label.
     * @returns {DocumentFragmentTag} Current instance for chaining.
     */
    setLabel(label) {
        this.state.label = label;
        return this;
    }

    /**
     * Returns the label string based on current properties.
     * @param {Object} props - Properties object, used if label is a function.
     * @returns {string} Computed label.
     */
    getLabelString(props) {
        return typeof this.label === 'function' ? this.label(props) : this.label;
    }

}

/**
 * @class
 * @extends DocumentFragmentTag
 * @property {HTMLElementState} state - The current state of the element.
 * @property {HTMLElementState|null} oldState - The previous state of the element.
 * @property {HTMLElement|null} element - The HTML element.
 */
export class HTMLElementTag extends DocumentFragmentTag {
    constructor() {
        super();
        this.state.tag = "div";
        this.state.attributes = {};
        this.state.events = {};
        this.state.styles = {};
    }

    /**
     * Assigns a single attribute.
     * @param {string} name - The attribute name.
     * @param {string} value - The attribute value.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setAttr(name, value) {
        this.state.attributes[name] = value;
        return this;
    }

    /**
     * Assigns multiple attributes.
     * @param {Record<string, string>} attributes - Attributes to assign.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setAttrs(attributes) {
        this.state.attributes = { ...this.state.attributes, ...attributes };
        return this;
    }

    /**
     * Assigns a single event handler.
     * @param {string} name - The event name.
     * @param {Function} listener - The event listener function.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setEvent(name, listener) {
        this.state.events[name] = listener;
        return this;
    }

    /**
     * Assigns multiple event handlers.
     * @param {Record<string, Function>} events - Event handlers to assign.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setEvents(events) {
        this.state.events = { ...this.state.events, ...events };
        return this;
    }
    /**
     * Assigns a single style.
     * @param {string} name - The style property name.
     * @param {string} value - The style value.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setStyle(name, value) {
        this.styles[name] = value;
        return this;
    }

    /**
     * Assigns multiple styles.
     * @param {Record<string, string>} styles - Styles to assign.
     * @returns {HTMLElementTag} Current instance for chaining.
     */
    setStyles(styles) {
        this.state.styles = { ...this.state.styles, ...styles };
        return this;
    }


    /**
     * Sets the HTML tag for the element.
     * @param {string} tag - The HTML tag.
     * @returns {HTMLElementTag} This instance for chaining.
     */
    setTag(tag) {
        this.state.tag = tag;
        return this;
    }


    /**
     * Creates and configures an HTML element based on provided properties and optionally manages labeled elements.
     * @param {Object} labeledElements - Optional object to store elements with labels.
     * @returns {HTMLElement} The created and configured HTML element.
     */
    createHTMLElement(labeledElements = {}) {
        const element = document.createElement(this.tag);
        this.setElementProps(element);
        for (const child of this.children) {
            if (child instanceof ElementProps) {
                element.appendChild(child.createHTMLElement(labeledElements));
            } else {
                element.appendChild(document.createTextNode(child));
            }
        }
        const label = this.getLabelString(this);
        if (label) {
            labeledElements[label] = { element, label, props: this };
        }
        return element;
    }

}

/**
 * @class
 * @property {ComponentState} state - The current state of the element.
 * @property {ComponentState|null} oldState - The previous state of the element.
 * @property {HTMLElement|null} element - The HTML element.
 */
export class ComponentTag  {
    constructor() {
        this.state.component = null;
        this.state.parameters = {};
    }

    /**
     * Sets a parameter for the component.
     * @param {string} name - The parameter name.
     * @param {*} value - The parameter value.
     * @returns {ComponentTag} This instance for chaining.
     */
    setParam(name, value) {
        this.state.params[name] = value;
        return this;
    }

    /**
     * Sets multiple parameters for the component.
     * @param {Object} params - Parameters to set.
     * @returns {ComponentTag} This instance for chaining.
     */
    setParams(params) {
        this.state.params = { ...this.state.params, ...params };
        return this;
    }

    /**
     * Creates and configures an HTML element based on provided properties and optionally manages labeled elements.
     * @param {Object} labeledElements - Optional object to store elements with labels.
     * @returns {HTMLElement} The created and configured HTML element.
     */
    createHTMLElement(labeledElements = {}) {
        const element = this.component(this);
        this.setElementProps(element);
        const label = this.getLabelString(this);
        if (label) {
            labeledElements[label] = { element, label, props: this };
        }
        return element;
    }
}

/**
 * Creates a new HtmlElementProps instance for a given tag.
 * @param {string} tag - The HTML tag to create.
 * @returns {HtmlElementProps} A new instance of HtmlElementProps.
 */
export function tag(tag) {
    return (new HTMLElementTag()).setTag(tag);
}

/**
 * Creates a new ComponentHtmlElementProps instance for a given component.
 * @param {Function} component - Component function that creates an element.
 * @returns {ComponentHtmlElementProps} A new instance of ComponentHtmlElementProps.
 */
export function component(component) {
    return new ComponentHtmlElementProps(component);
}

