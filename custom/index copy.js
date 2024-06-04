/**
 * Creates an HTML element with specified attributes, events, and children.
 *
 * @param {string} tag - The tag name of the element to create.
 * @param {Object} [options={}] - Options for the element.
 * @param {Object} [options.attributes={}] - Attributes to set on the element.
 * @param {Object} [options.events={}] - Events to add to the element.
 * @param {Array} [options.children=[]] - Children to append to the element.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(tag, { attributes = {}, events = {}, children = [] } = {}) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key in element) {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    });

    Object.entries(events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });

    return element;
}

/**
 * Creates an observable object that notifies listeners of changes.
 *
 * @param {Object|Array} data - The data to observe.
 * @returns {Object} An observable object with data and bind method.
 */
function observable(data) {
    const listeners = new Set();

    const proxy = new Proxy(data, {
        get(target, key) {
            if (Array.isArray(target) && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(key)) {
                return function (...args) {
                    const result = Array.prototype[key].apply(target, args);
                    listeners.forEach(listener => listener());
                    return result;
                };
            }
            if (typeof target[key] === 'object' && target[key] !== null) {
                return observable(target[key]).data;
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            listeners.forEach(listener => listener());
            return true;
        }
    });

    /**
     * Binds a listener function to be called on data changes.
     *
     * @param {Function} listener - The listener function to call on data changes.
     * @returns {Function} A function to unbind the listener.
     */
    function bind(listener) {
        listeners.add(listener);
        listener(); // Initial call to set up
        return () => listeners.delete(listener);
    }

    return { data: proxy, bind };
}


/**
 * Creates a list item component.
 *
 * @param {Object} props - Properties for the list item.
 * @param {Object} props.item - The item data.
 * @returns {HTMLElement} The created list item element.
 */
function ListItemComponent({ item }) {
    const element = createElement('li', { attributes: { textContent: item.text, 'data-id': item.id } });

    return element;
}

/**
 * Creates a list component with add item functionality.
 *
 * @returns {HTMLElement} The created list component.
 */
function ListComponent() {
    const state = observable({ items: [] });

    /**
     * Adds a new item to the list.
     */
    function addItem() {
        
    }
 

    const list = createElement('ul');

    state.bind(() => {
        const items = state.data.items;
        const children = Array.from(list.children);
        const existingItems = new Map(children.map(child => [child.getAttribute('data-id'), child]));

        // Update existing children and add new ones
        items.forEach((item, index) => {
            if (existingItems.has(item.id)) {
                const child = existingItems.get(item.id);
                child.textContent = item.text;
                list.insertBefore(child, list.children[index]); // Ensure correct order
            } else {
                const newChild = ListItemComponent({ item });
                list.insertBefore(newChild, list.children[index] || null); // Insert new child
            }
        });

        // Remove excess children
        while (list.children.length > items.length) {
            list.removeChild(list.lastChild);
        }
    });

    return createElement('div', { children: [
        createElement('button', {
            attributes: { textContent: 'Add Item' },
            events: { click: ()=>{
                const newItem = { id: `item-${state.data.items.length + 1}`, text: `Item ${state.data.items.length + 1}` };
                // Use state.data.items.push
                state.data.items = [...state.data.items, newItem]; // Spread operator to trigger Proxy set handler
                console.log('Item added:', newItem); // Debugging log
            } }
        })
        ,
        createElement('button', {
            attributes: { textContent: 'Add Item 2' },
            events: { click: ()=>{
                const newItem = { id: `item-${state.data.items.length + 1}`, text: `Item ${state.data.items.length + 1}` };
                state.data.push = newItem
                console.log('Item added:', newItem); // Debugging log
            } }
        })
        ,
        list] });
}

document.body.appendChild(ListComponent());
