import { createElement, observable } from './lib.js';

const debugMode = true;

function log(message, ...args) {
    if (debugMode) {
        console.log(message, ...args);
    }
}

/**
 * Creates a list item component.
 *
 * @param {Object} props - Properties for the list item.
 * @param {Object} props.item - The item data.
 * @returns {HTMLElement} The created list item element.
 */
function ListItemComponent({ item }) {
    log('ListItemComponent rendered', item);
    return createElement('li', { attributes: { textContent: item.text, 'data-id': item.id } });
}

/**
 * Helper function to manage list elements efficiently.
 *
 * @param {HTMLElement} list - The list element.
 * @param {Array} items - The items to manage in the list.
 * @param {Function} createItemComponent - Function to create an item component.
 */
function manageList(list, items, createItemComponent) {
    const children = Array.from(list.children);
    const existingItems = new Map(children.map(child => [child.getAttribute('data-id'), child]));

    items.forEach((item, index) => {
        const existingItem = existingItems.get(item.id);
        if (existingItem) {
            // existingItem.textContent = item.text;
            list.insertBefore(existingItem, list.children[index]);
        } else {
            const newItem = createItemComponent(item);
            list.insertBefore(newItem, list.children[index] || null);
        }
    });

    while (list.children.length > items.length) {
        list.removeChild(list.lastChild);
    }
}

/**
 * Creates a list component with add item functionality.
 *
 * @returns {HTMLElement} The created list component.
 */
function ListComponent() {
    log('ListComponent rendered');
    const state = observable({ items: [] });
    const list = createElement('ul');

    state.$onSet(() => {
        log('ListComponent state changed', state.items);
        manageList(list, state.items, item => ListItemComponent({ item }));
    });

    return createElement('div', {
        children: [
            createElement('button', {
                attributes: { textContent: 'Add Item' },
                events: {
                    click: () => {
                        const newItem = { id: `item-${state.items.length + 1}`, text: `Item ${state.items.length + 1}` };
                        state.items = [...state.items, newItem];
                        log('Item added:', newItem);
                    }
                }
            }),
            list
        ]
    });
}

/**
 * Task class representing a task.
 */
class Task {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
}

/**
 * Creates a task item component.
 *
 * @param {Object} props - Properties for the task item.
 * @param {Task} props.task - The task data.
 * @param {Function} props.onComplete - Function to call when the task is completed.
 * @param {Function} props.onRemove - Function to call when the task is removed.
 * @returns {HTMLElement} The created task item element.
 */
function TaskItemComponent({ task, onRemove }) {
    log('TaskItemComponent rendered', task);

    const taskClass = task.completed ? 'completed' : '';

    task.$onSet(() => {
        log('TaskItemComponent $onSet', task);
    });

    return createElement('li', {
        attributes: { className: taskClass, 'data-id': task.id },
        children: [
            createElement('span', { attributes: { textContent: task.completed ? "COMPLETED" : "NOT COMPLETED" } }),
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
}

/**
 * Creates a task list component with add, complete, and remove task functionality.
 *
 * @returns {HTMLElement} The created task list component.
 */
function TaskListComponent() {
    log('TaskListComponent rendered');
    const state = observable({ 
        tasks: [
        new Task('task-1', 'Task 1'),
        new Task('task-2', 'Task 2'),
        new Task('task-3', 'Task 3')    
    ] , name: "taskManager", showLoading: true});
    log('TaskListComponent state initialized', state);

    /**
     * Adds a new task to the list.
     *
     * @param {string} taskText - The text of the new task.
     */
    function addTask(taskText) {
        const newTask = observable( new Task(`task-${state.tasks.length + 1}`, "taskText"), state.tasks.length, state.tasks);
        log('Task added observable:', state.tasks.length, newTask);
        state.tasks = [...state.tasks, newTask];
        log('Task added:', newTask);
    }

    // /**
    //  * Marks a task as completed.
    //  *
    //  * @param {string} taskId - The ID of the task to complete.
    //  */
    // function completeTask(taskId) {
    //     state.tasks = state.tasks.map(task => 
    //         task.completed = true
    //     );
    //     log('Task completed:', taskId);
    // }

    /**
     * Removes a task from the list.
     *
     * @param {string} taskId - The ID of the task to remove.
     */
    function removeTask(taskId) {
        state.tasks = state.tasks.filter(task => task.id !== taskId);
        log('Task removed:', taskId);
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
    const addButton2 = createElement('button', {
        attributes: { textContent: 'Add Task2' },
        events: { click: () => {
            if (input.value.trim()) {
                const newTask = observable( new Task(`task-${state.tasks.length + 1}`, "taskText"), state.tasks.length, state.tasks);
                state.tasks.push(newTask)
                log('Task added push:', newTask);
                input.value = '';
            }
        }}
    });
    const logStateButton =  createElement('button', {
        attributes: { textContent: 'Log State' },
        events: { click: () => log('TaskListComponent state', state) }
    }) 
    const list = createElement('ul');

    state.$onSet(["tasks"],() => {
        log('TaskListComponent state tasks changed');
        manageList(list, state.tasks, task => TaskItemComponent({ task, onComplete: completeTask, onRemove: removeTask }));
    });
    state.$onSet(["showLoading"],() => {
        log('TaskListComponent showLoading changed');
    });
    // state.tasks.$onSet(() => {
    //     log('TaskListComponent state.tasks changed');
    //     manageList(list, state.tasks, task => TaskItemComponent({ task, onComplete: completeTask, onRemove: removeTask }));
    // });

    return createElement('div', { children: [input, addButton,logStateButton,addButton2, list] });
}

document.body.appendChild(TaskListComponent());
