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
 * Logs debug information if debug mode is enabled.
 *
 * @param {...any} args - The information to log.
 */
const debug = (mode, ...args) => { if (mode) console.log(...args); };

/**
 * Creates a task item component.
 *
 * @param {Object} props - Properties for the task item.
 * @param {Object} props.task - The task data.
 * @param {Function} props.onComplete - Function to call when the task is completed.
 * @param {Function} props.onRemove - Function to call when the task is removed.
 * @param {boolean} debugMode - Enable or disable debug mode.
 * @returns {HTMLElement} The created task item element.
 */
function TaskItemComponent({ task, onComplete, onRemove }, debugMode = false) {
    debug(debugMode, 'TaskItemComponent rendered', task);

    const taskClass = task.completed ? 'completed' : '';
    const element = createElement('li', {
        attributes: { className: taskClass, 'data-id': task.id },
        children: [
            createElement('span', { attributes: { textContent: task.text } }),
            createElement('button', {
                attributes: { textContent: 'Complete' },
                events: { click: () => onComplete(task.id) }
            }),
            createElement('button', {
                attributes: { textContent: 'Remove' },
                events: { click: () => onRemove(task.id) }
            })
        ]
    });

    return element;
}

/**
 * Binds a list state to a DOM element, updating it on state changes.
 *
 * @param {Array} stateItems - The state items to bind.
 * @param {HTMLElement} listElement - The DOM element representing the list.
 * @param {Function} createItemComponent - Function to create a list item component.
 * @param {Function} debugMode - Enable or disable debug mode.
 */
function bindList(stateItems, listElement, createItemComponent, debugMode = false) {
    const children = Array.from(listElement.children);
    const existingItems = new Map(children.map(child => [child.getAttribute('data-id'), child]));

    stateItems.forEach((item, index) => {
        if (existingItems.has(item.id)) {
            const child = existingItems.get(item.id);
            listElement.insertBefore(child, listElement.children[index]); // Ensure correct order
        } else {
            const newChild = createItemComponent(item);
            listElement.insertBefore(newChild, listElement.children[index] || null); // Insert new child
        }
    });

    while (listElement.children.length > stateItems.length) {
        listElement.removeChild(listElement.lastChild);
    }

    debug(debugMode, 'List updated', stateItems);
}

/**
 * Creates a task list component with add, complete, and remove task functionality.
 *
 * @param {boolean} debugMode - Enable or disable debug mode.
 * @returns {HTMLElement} The created task list component.
 */
function TaskListComponent(debugMode = false) {
    debug(debugMode, 'TaskListComponent rendered');
    const state = observable({ tasks: [] });

    function addTask(taskText) {
        const newTask = {
            id: `task-${state.data.tasks.length + 1}`,
            text: taskText,
            completed: false
        };
        state.data.tasks = [...state.data.tasks, newTask];
        debug(debugMode, 'Task added:', newTask);
    }

    function completeTask(taskId) {
        state.data.tasks = state.data.tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        debug(debugMode, 'Task completed:', taskId);
    }

    function removeTask(taskId) {
        state.data.tasks = state.data.tasks.filter(task => task.id !== taskId);
        debug(debugMode, 'Task removed:', taskId);
    }

    const input = createElement('input', { attributes: { type: 'text', placeholder: 'New task...' } });
    const addButton = createElement('button', {
        attributes: { textContent: 'Add Task' },
        events: { click: () => {
            if (input.value.trim()) {
                addTask(input.value);
                input.value = '';
            }
        }}
    });

    const list = createElement('ul');

    state.bind(() => bindList(state.data.tasks, list, task => TaskItemComponent({ task, onComplete: completeTask, onRemove: removeTask }, debugMode), debugMode));

    return createElement('div', { children: [input, addButton, list] });
}

document.body.appendChild(TaskListComponent(true));
