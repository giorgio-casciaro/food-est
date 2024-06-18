// Enumeration for the type of operations on nodes
const NodeType = {
    TEXT: 0,
    ATTRIBUTE: 1,
    EVENT: 2,
    CONTENT: 3,
    SLOT: 4,
    ELEMENT: 5,
    LABEL: 5
};

// Keys for accessing properties in node arguments
const NodeKey = {
    TAG: 1,
    VALUE: 1,
    ELEMENT_REF: 2,
    NAME: 1,
    LABEL: 1,
    DATA: 2
};

// Create a structure for managing dynamic nodes
function createNodeTemplate(parent, blueprint) {
    return {
        dynamicElem: createDynamicElement(parent),
        blueprint,
        slots: {}
    };
}

// Render the node template into DOM
function renderTemplate(templateData) {
    const rootElement = templateData.blueprint();
    updateNode(templateData, templateData.dynamicElem, rootElement);
    return templateData.dynamicElem.elem;
}

// Initializes a dynamic element structure
function createDynamicElement(parent) {
    return {
        elem: null,
        parent,
        children: {},
        tag: null,
        args: []
    };
}


// Recursively render and update nodes based on blueprint
function updateNode(templateData, dynamicElem, nodeBlueprint) {
    console.log("updateNode dynamicElem", dynamicElem);
    console.log("updateNode nodeBlueprint", nodeBlueprint);
    if (dynamicElem.tag !== nodeBlueprint[NodeKey.TAG]) {
        const newElem = document.createElement(nodeBlueprint[NodeKey.TAG]);
        dynamicElem.elem?.parent?.replaceChild(newElem, dynamicElem.elem) || dynamicElem.parent?.elem.appendChild(newElem);
        dynamicElem.elem = newElem;
    }

    dynamicElem.tag = nodeBlueprint[NodeKey.TAG];
    let oldActiveNodeArgumentIndex = activeNodeArgumentIndex;
    activeNodeArgumentIndex = 0;
    nodeBlueprint.slice(2).forEach((arg) => {
        processNodeArgument(dynamicElem, arg, templateData); // Passed templateData to processNodeArgument

    });
    activeNodeArgumentIndex = oldActiveNodeArgumentIndex;
}

// Process node arguments to add, update, or remove elements
function processNodeArgument(dynamicElem, newArg, templateData) { // Added templateData parameter
    console.log("processNodeArgument dynamicElem", dynamicElem);
    console.log("processNodeArgument", dynamicElem.args);
    const existingArg = dynamicElem.args[activeNodeArgumentIndex];

    if (newArg == null) {
        removeArgument(dynamicElem, existingArg );
    } else {
        addOrUpdateArgument(dynamicElem, newArg, existingArg,   templateData); // Passed templateData to addOrUpdateArgument
    }

    dynamicElem.args[activeNodeArgumentIndex] = newArg;

    activeNodeArgumentIndex += 1
}


// Remove an argument from a dynamic element
function removeArgument(dynamicElem, oldArg) {
    if (!oldArg) return;

    switch (oldArg[0]) {
        case NodeArgumentType.TEXT:
            dynamicElem.elem.removeChild(dynamicElem.children[activeNodeArgumentIndex]);
            break;
        case NodeArgumentType.ATTRIBUTE:
            dynamicElem.elem.removeAttribute(oldArg[NodeKey.NAME]);
            break;
        case NodeArgumentType.EVENT:
            dynamicElem.elem.removeEventListener(oldArg[NodeKey.NAME], oldArg[NodeKey.DATA]);
            break;
        case NodeArgumentType.ELEMENT:
            dynamicElem.elem.removeChild(dynamicElem.children[activeNodeArgumentIndex].elem);
            break;
        default:
            break; // SLOT and CONTENT removal logic if needed
    }
    dynamicElem.children[activeNodeArgumentIndex] = null;
}
// Add or update an argument in a dynamic element
function addOrUpdateArgument(dynamicElem, newArg, oldArg,  templateData) { // Added templateData parameter
    switch (newArg[0]) {
        case NodeArgumentType.TEXT:
            const textNode = (!oldArg || oldArg[NodeKey.VALUE] !== newArg[NodeKey.VALUE]) ? document.createTextNode(newArg[NodeKey.VALUE]) : dynamicElem.children[activeNodeArgumentIndex];
            if (!oldArg) {

                if (activeNodeArguments) {
                    let index = activeNodeArguments.indexOf(newArg);
                    if (index !== -1) {
                        activeNodeArguments.splice(index, 1);
                    }
                }
                dynamicElem.elem.appendChild(textNode);
                dynamicElem.children[activeNodeArgumentIndex] = textNode;
            } else {
                dynamicElem.children[activeNodeArgumentIndex].textContent = newArg[NodeKey.VALUE];
            }
            break;
        case NodeArgumentType.ATTRIBUTE:
            if (!oldArg || oldArg[NodeKey.DATA] !== newArg[NodeKey.DATA]) {
                dynamicElem.elem.setAttribute(newArg[NodeKey.NAME], newArg[NodeKey.DATA]);
            }
            break;
        case NodeArgumentType.EVENT:
            if (!oldArg || oldArg[NodeKey.DATA] !== newArg[NodeKey.DATA]) {
                oldArg && dynamicElem.elem.removeEventListener(oldArg[NodeKey.NAME], oldArg[NodeKey.DATA]);
                dynamicElem.elem.addEventListener(newArg[NodeKey.NAME], newArg[NodeKey.DATA]);
            }
            break;
        case NodeArgumentType.ELEMENT:
            if (!oldArg) {
                if (activeNodeArguments) {
                    let index = activeNodeArguments.indexOf(newArg);
                    if (index !== -1) {
                        activeNodeArguments.splice(index, 1);
                    }
                }
                const childElem = createDynamicElement(dynamicElem);
                updateNode(templateData, childElem, newArg); // Passed templateData to updateNode
                dynamicElem.children[activeNodeArgumentIndex] = childElem;
            } else {
                updateNode(templateData, dynamicElem.children[activeNodeArgumentIndex], newArg); // Passed templateData to updateNode
            }
            break;
        case NodeArgumentType.CONTENT:
            const contentFunc = newArg[NodeKey.VALUE];
            const oldActiveNodeArguments = activeNodeArguments;
            activeNodeArguments = [];
            contentFunc();
            console.log(`NodeType.CONTENT activeNodeArguments `, JSON.stringify(activeNodeArguments));
            // activeNodeArguments.reverse()
            // let childElems = []
            let loopCount = 0
            while (activeNodeArguments.length&&loopCount<1000) {
                const bottomNodeArgument = activeNodeArguments[activeNodeArguments.length-1];
                // let newNodeArgumentIndex = index+"_c_"+loopCount
                // console.log(`NodeType.CONTENT newNodeArgumentIndex ${newNodeArgumentIndex}`);
                processNodeArgument(dynamicElem, bottomNodeArgument,  templateData)
                console.log("NodeType.CONTENT bottomNodeArgument ", JSON.stringify(bottomNodeArgument));
                // const childElem = dynamicElem.children[index]&&dynamicElem.children[index][i] ? dynamicElem.children[index][i] : createDynamicElement(dynamicElem);
                // console.log("NodeType.CONTENT childElem ", childElem);
                // updateNode(templateData, childElem, activeNodeArgument);
                // console.log("NodeType.CONTENT activeNodeArgument 2 ", i, JSON.stringify(activeNodeArgument));
                // childElems.push(childElem);
                
                console.log(`NodeType.CONTENT loopCount ${loopCount} activeNodeArguments.length ${activeNodeArguments.length} `);
                loopCount += 1
            }
            // dynamicElem.children[index] = childElems;
            activeNodeArguments = oldActiveNodeArguments;
            break;

        case NodeArgumentType.SLOT:
            // Register or update slot with new content
            dynamicElem.slots[newArg[NodeKey.NAME]] = newArg[NodeKey.DATA] || null; // Optionally handle default content
            break;

        default:
            break;
    }
}
let activeNodeArgumentIndex = 0;
let activeNodeArguments = null;
let activeNodeArgumentCheck = (node) => {
    if (activeNodeArguments !== null) {
        activeNodeArguments.push(node);
    }
    return node
};

// Helper functions to facilitate node creation
const text = (value, label = null) => activeNodeArgumentCheck([NodeArgumentType.TEXT, value, label]);
const attribute = (name, value) => [NodeArgumentType.ATTRIBUTE, name, value];
const onEvent = (event, listener) => [NodeArgumentType.EVENT, event, listener];
const content = (func) => [NodeArgumentType.CONTENT, func];
const slot = (name) => activeNodeArgumentCheck([NodeArgumentType.SLOT, name]);
const element = (tag, ...args) => activeNodeArgumentCheck([NodeArgumentType.ELEMENT, tag, ...args]);
const label = (label) => [NodeArgumentType.LABEL, label];
const empty = activeNodeArgumentCheck(() => null);

// Application state
let state = {
    title: "Dynamic Title",
    clickCount: 0
};

// Example template demonstrating dynamic updates
function mainTemplate() {
    return element("div",
        attribute("class", "container"),
        text(state.title),
        element("button",
            text(`Click me: ${state.clickCount}`),
            onEvent("click", () => {
                state.clickCount++;
                renderTemplate(nodeTemplate); // Re-render to reflect state changes
            })
        ),
        state.clickCount > 5 ? text("You have clicked many times!") : null,
        content(() => {
            // if (state.clickCount > 7) { text("1 You have clicked many times!") }
            // else if (state.clickCount > 5) { text(`click more ${7 - state.clickCount}`) }
            // else { empty() }

            // if (state.clickCount > 7) { text("2 You have clicked many times!", "label") }
            // else if (state.clickCount > 5) { text(`click more ${7 - state.clickCount}`, "label") }

            // slot("test")
            // if (state.clickCount > 7) { element("div", label("label"), text("3 You have clicked many times!")) }
            // else if (state.clickCount > 5) { element("div", label("label"), text(`click more ${7 - state.clickCount}`)) }

            // if(state.clickCount > 7){element(["div","label"],text("You have clicked many times!"))}
            // else if(state.clickCount > 5){element(["div","label"],label("label"),text(`click more ${7-state.clickCount}`))}

            // if(state.clickCount > 7){element(["div","label"],text("You have clicked many times!"))}
            // else if(state.clickCount > 5){element(["div","label"],label("label"),text(`click more ${7-state.clickCount}`))}

            // showIf(state.clickCount > 7, element("div#label",text("You have clicked many times!")))
            // showElse(state.clickCount > 5, element("div#label",text(`click more ${7-state.clickCount}`)))
            // showElse(element("div#label",text("You have clicked many times!")))

            // htmlString(`<div><div><div><h5>HTML ${state.clickCount}</h5></div></div></div>`)
            // html(`<div>`,`<div>`,`<h5>`,`HTML ${state.clickCount}`)
            // html(`<div>`,[`<h5>`,`HTML ${state.clickCount}`],[`<h6>`,`HTML ${state.clickCount}`])
            // text(`TEXT Click me: ${state.clickCount}`)
            element("div", element("div", text(`TAG Click me: ${state.clickCount}`)))
        })
    );
}

// Initialize node template and mount to DOM
let nodeTemplate = createNodeTemplate(null, mainTemplate);
const renderedElement = renderTemplate(nodeTemplate);
document.body.appendChild(renderedElement);


// setTimeout(() => {
//     state.title = null
//     renderTemplate(nodeTemplate)
//     console.log(nodeTemplate)
//     setTimeout(() => {
//         state.title = "new Title"
//         renderTemplate(nodeTemplate)
//         console.log(nodeTemplate)
//     }, 3000)
// }, 3000)
