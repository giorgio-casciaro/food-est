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
 * @property {string|null} tag - The HTML tag.
 * @property {Object<string, string>} attributes - HTML attributes as key-value pairs.
 * @property {Object<string, Function>} events - Event listeners as key-function pairs.
 * @property {Object<string, string>} styles - Styles as key-value pairs.
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
 * @property {number} childrenCounter 
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


        this.childrenCounter = 0;
    }


    addChild(child) {
        this.childrenCounter++;
        let oldChild = this.children[this.childrenCounter];
        if(!oldChild){
            let newChild = typeof child === 'function' ? child(tagName=>tag(tagName)) : child
            let newChildElement
            if(newChild instanceof DocumentFragmentTag || newChild instanceof HTMLElementTag ){
                newChildElement = newChild.element;
            } else {
                newChildElement = document.createTextNode(newChild) 
            }
            this.element.appendChild(newChildElement);
            this.children.push(newChild);
        }else{
            child(child.setTag)
        }
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
        this.state.tag = null;
        this.state.attributes = {};
        this.state.events = {};
        this.state.styles = {};
    }


    setTag(tag) {
        if(this.state.tag !== tag){
            if(this.element === null){
                this.element = document.createElement(tag);
            }else if(this.element.parentElement){
                let newElement = document.createElement(tag);
                this.element.parentElement.replaceChild(newElement, this.element);
                this.element = newElement;
            }
            this.state.tag = tag;
        }
        console.log("setTag", tag, this.element);
        return this;
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




}

/**
 * Creates a new HtmlElementProps instance for a given tag.
 * @param {string} tag - The HTML tag to create.
 * @returns {HtmlElementProps} A new instance of HtmlElementProps.
 */
export function tag(tag) {
    return (new HTMLElementTag()).setTag(tag);
}


