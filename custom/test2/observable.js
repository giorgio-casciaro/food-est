/**
 * @file observable.js
 * @description This file contains commonly used utility functions and types for the Food Est project.
 * It includes functions for creating HTML elements, handling observables, and defining types for HTML element props.
 * @version 0.0.1
 */

/**
 * Creates an observable object that notifies listeners of changes.
 *
 * @param {Object|Array} data - The data to observe.
 * @returns {Object} An observable object with data and bind method.
 */
export function observable(data, name = "ROOT", parent = null) {
    console.log(`Observable ${name} created with data:`, data);
    const listeners = new Set();

    /**
     * Adds a listener function to be called when a specific property is updated.
     *
     * @param {Array} keys - An array of property keys to listen for.
     * @param {Function} listenerFn - The listener function to be called when the property is set or updated.
     * @param {boolean} initialCall - Whether to call the listener initially.
     * @return {Function} A function to unbind the listener.
     */
    const $onSet = (keys, listenerFn) => {
        const listener = { keys, listenerFn };
        listeners.add(listener);
        console.log(`Observable ${name} - Listener added. Total listeners: ${listeners.size}`);
        return () => {
            listeners.delete(listener);
            console.log(`Observable ${name} - Listener removed. Total listeners: ${listeners.size}`);
        };
    };


    let updateStarted = false;
    const propsUpdated = new Set();

    function updateUi() {
        console.log(`Observable ${name} update triggered for keys:`, Array.from(propsUpdated));
        listeners.forEach(listener => {
            const execute = listener.keys.some(key => propsUpdated.has(key));
            if (execute) listener.listenerFn();
        });
        updateStarted = false;
        propsUpdated.clear();
    }

    const proxy = new Proxy(data, {
        get(target, key) {
            if (key === "$onSet") return $onSet;
            return target[key];
        },
        set(target, key, value) {
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
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            data[key] = observable(value, key, proxy);
        }
    }

    return proxy;
}
