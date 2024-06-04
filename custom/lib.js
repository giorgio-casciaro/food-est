class HtmlElementProps {
    /**
     * Creates an instance of HtmlElementProps.
     *
     * @param {string} tag - The tag name of the element to create. Defaults to "div".
     * @param {Object} attributes - Attributes to set on the element. Defaults to an empty object.
     * @param {Object} events - Events to add to the element. Defaults to an empty object.
     * @param {Array} children - Children to append to the element. Defaults to an empty array.
     */
    constructor(tag = "div", attributes = {}, events = {}, children = []) {
        this.tag = tag;
        this.attributes = attributes;
        this.events = events;
        this.children = children;
    }
}

/**
 * Creates an instance of HtmlElementProps with the given tag, attributes, events, and children.
 *
 * @param {string} tag - The tag name of the element to create.
 * @param {Object} [attributes={}] - Attributes to set on the element.
 * @param {Object} [events={}] - Events to add to the element.
 * @param {Array} [children=[]] - Children to append to the element.
 * @return {HtmlElementProps} The created HtmlElementProps instance.
 */
export function tag(tag, attributes = {}, events = {}, children = []) {
    return new HtmlElementProps(tag, attributes, events, children);
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
            console.log("proxy", name, "GET", typeof (target[key]), key, target);
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
