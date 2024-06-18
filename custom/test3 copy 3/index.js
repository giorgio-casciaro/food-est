// Enumeration for the type of operations on nodes
const NodeArgumentType = {
    TEXT: 0,
    ATTRIBUTE: 1,
    EVENT: 2,
    CONTENT: 3,
    SLOT: 4,
    ELEMENT: 5,
    LABEL: 6
};

// Keys for accessing properties in node arguments
const ArgumentKey = {
    TYPE: 0,
    TAG: 1,
    VALUE: 1,
    ELEMENT_REF: 2,
    NAME: 1,
    LABEL: 1,
    DATA: 2
};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}
function debugArgumentKey(value) {
    return getKeyByValue(ArgumentKey, value)
}
function debugNodeArgumentType(value) {
    return getKeyByValue(NodeArgumentType, value)
}
// Create a structure for managing dynamic nodes
function createNodeTemplate(parent, blueprint) {
    console.log("Creating node template with parent:", parent, "and blueprint:", blueprint);
    return {
        node: createNode(parent),
        blueprint,
        slots: {}
    };
}

// Render the node template into DOM
function renderTemplate(templateData) {
    console.group("\u{1F4C4} %c renderTemplate ", "background-color:green;color:white ; font-size:1.2em; padding:0.2em");
    console.log("renderTemplate", templateData);
    const rootElement = templateData.blueprint();
    updateNode(templateData, templateData.node, rootElement);
    console.groupEnd();
    return templateData.node.dom;
}

function getCurrentNodeChild(node) {
    let child = node.children[node.childIndex]
    if(!child){
        console.log("getCurrentNodeChild error", {childIndex:node.childIndex, node})
        throw new Error("getCurrentNodeChild");
    };
    node.childIndex += 1
    return child
}
function createNodeChildPlaceholder(parent) {
    console.log("createNodeChildPlaceholder ", parent);
    if(parent){  
        parent.children[parent.childIndex] = node
        parent.childIndex += 1
    }
    return true;
}
function isNodeChildPlaceholder(value) {
    return value === true;
}
// Initializes a dynamic element structure
function createNode(parent) {
    console.log("createNode ", parent);
    let node =  {
        dom: null,
        parent,
        children: {},
        tag: null,
        args: [],
        argsIndex: 0,
        childIndex: 0,
        scatteredSubNodesArgs: null,
    };

    if(parent){  
        parent.children[parent.childIndex] = node
        parent.childIndex += 1
        // if(parent.scatteredSubNodesArgs !== null){
        //     node.scatteredSubNodesArgs = parent.scatteredSubNodesArgs
        //     const shiftedNode = parent.scatteredSubNodesArgs.shift()
        //     console.log("createNode shiftedNode", shiftedNode);
        // }
    }
    return node;
}
function createNodeDomChild(dom, parent) {
    let node = {
        dom,
        parent
    }
    console.log("createNodeDomChild", node);
    if(parent){  
        parent.children[parent.childIndex] = node
        parent.childIndex += 1
        parent.dom.appendChild(node.dom)
        // if(parent.scatteredSubNodesArgs !== null){
        //     const shiftedNode = parent.scatteredSubNodesArgs.shift()
            
        //     console.log("createNodeDomChild shiftedNode", shiftedNode);
        // }
    }
    return node;
}

// Recursively render and update nodes based on blueprint
function updateNode(templateData, node, nodeBlueprint) {
    console.group(`\u{1F4E6} %c ${nodeBlueprint[ArgumentKey.TAG]} (${node.parent?.childIndex ?? "root"}) `, "background-color:seagreen;color:white ;  padding:0.2em"); 
    console.log("params",{ templateData, node, nodeBlueprint});
    if (node.tag !== nodeBlueprint[ArgumentKey.TAG]) {
        console.log("Updating tag from", node.tag, "to", nodeBlueprint[ArgumentKey.TAG]);
        const newElem = document.createElement(nodeBlueprint[ArgumentKey.TAG]);
        node.dom?.parent?.replaceChild(newElem, node.dom) || node.parent?.dom.appendChild(newElem);
        node.dom = newElem;
    }
    console.log("dom",node.dom);
    node.tag = nodeBlueprint[ArgumentKey.TAG];
    node.argsIndex = 0;
    node.childIndex = 0;
    let oldActiveNode = activeNode
    activeNode = node
    nodeBlueprint.slice(2).forEach((arg) => {
        processNodeArgument(node, arg, templateData); // Passed templateData to processNodeArgument
       
    });
    activeNode = oldActiveNode
    console.groupEnd()
}

// Process node arguments to add, update, or remove elements
function processNodeArgument(node, newArg, templateData) { // Added templateData parameter

    console.group(`\u{1F3F7} %c ${newArg ? debugNodeArgumentType(newArg[ArgumentKey.TYPE]): "null"} (${node.argsIndex }) ${newArg && typeof newArg[1] == "string" ? newArg[1] : ""} `, "background-color:lightseagreen;color:white ;  padding:0.2em"); 
    console.log(`params`, {node, newArg, templateData});
    const oldArg = node.args[node.argsIndex];

    if (newArg == null) {
        if(isNodeChildPlaceholder(oldArg)){
            newArg = oldArg
            node.childIndex += 1;
        }else if(oldArg){
            newArg = removeArgument(node, newArg, oldArg);
        }
    } else {
        newArg = addOrUpdateArgument(node, newArg, oldArg, templateData); // Passed templateData to addOrUpdateArgument
    }

    node.args[node.argsIndex] = newArg;
    node.argsIndex += 1;
    console.groupEnd()
}

// Remove an argument from a dynamic element
function removeArgument(node, newArg, oldArg) {
    console.log("removeArgument", {node, oldArg});
    if (!oldArg){ 
        console.dir({node, oldArg}); 
        throw new Error("removeArgument");
     }

    switch (oldArg[ArgumentKey.TYPE]) {
        case NodeArgumentType.TEXT:
            node.dom.removeChild(node.children[activeNodeArgumentIndex]);
            newArg = createNodeChildPlaceholder(node)
            break;
        case NodeArgumentType.ATTRIBUTE:
            node.dom.removeAttribute(oldArg[ArgumentKey.NAME]);
            break;
        case NodeArgumentType.EVENT:
            node.dom.removeEventListener(oldArg[ArgumentKey.NAME], oldArg[ArgumentKey.DATA]);
            break;
        case NodeArgumentType.ELEMENT:
            node.dom.removeChild(node.children[activeNodeArgumentIndex].dom);
            newArg = createNodeChildPlaceholder(node)
            break;
        default:
            console.error("removeArgument", {node, oldArg});
            break; // SLOT and CONTENT removal logic if needed
    }
    return newArg
}

// Add or update an argument in a dynamic element
function addOrUpdateArgument(node, newArg, oldArg, templateData) { 
    console.log(`addOrUpdateArgument ${debugNodeArgumentType(newArg[ArgumentKey.TYPE])}`,{node, newArg,  oldArg, templateData});

    switch (newArg[ArgumentKey.TYPE]) {
        case NodeArgumentType.TEXT:
            const textChildElem = !oldArg ? createNodeDomChild(document.createTextNode(newArg[ArgumentKey.VALUE]), node):getCurrentNodeChild(node);
            console.log("addOrUpdateArgument NodeArgumentType.TEXT", {textChildElem, oldArg, node});

            if(node.scatteredSubNodesArgs !== null){
                const shiftedNode = node.scatteredSubNodesArgs.shift()
                console.log("node.scatteredSubNodesArgs", shiftedNode);
            }
            if(oldArg && oldArg[ArgumentKey.VALUE] !== newArg[ArgumentKey.VALUE]){
                textChildElem.dom.textContent = newArg[ArgumentKey.VALUE];
            }
            break;
        case NodeArgumentType.ATTRIBUTE:
            if (!oldArg || oldArg[ArgumentKey.DATA] !== newArg[ArgumentKey.DATA]) {
                node.dom.setAttribute(newArg[ArgumentKey.NAME], newArg[ArgumentKey.DATA]);
            }
            break;
        case NodeArgumentType.EVENT:
            if (!oldArg || oldArg[ArgumentKey.DATA] !== newArg[ArgumentKey.DATA]) {
                oldArg && node.dom.removeEventListener(oldArg[ArgumentKey.NAME], oldArg[ArgumentKey.DATA]);
                node.dom.addEventListener(newArg[ArgumentKey.NAME], newArg[ArgumentKey.DATA]);
            }
            break;
        case NodeArgumentType.ELEMENT:
            const childNode = !oldArg ? createNode(node):getCurrentNodeChild(node);
            childNode.scatteredSubNodesArgs = node.scatteredSubNodesArgs
            if(node.scatteredSubNodesArgs !== null){
                const shiftedNode = node.scatteredSubNodesArgs.shift()
                console.log("node.scatteredSubNodesArgs", shiftedNode);
            }
            console.log("addOrUpdateArgument NodeArgumentType.ELEMENT", {childNode, oldArg, node});
            updateNode(templateData, childNode, newArg); 
            
            break;
        case NodeArgumentType.CONTENT:
            const contentFunc = newArg[ArgumentKey.VALUE];
            node.scatteredSubNodesArgs = [];
            contentFunc();
            console.log("NodeType.CONTENT node.scatteredSubNodesArgs:", JSON.stringify(node.scatteredSubNodesArgs));
            let loopCount = 0;
            while (node.scatteredSubNodesArgs.length && loopCount < 1000) {
                const bottomSubNodeArgument = node.scatteredSubNodesArgs.pop();
                console.log("NodeType.CONTENT bottomNodeArgument:", JSON.stringify(bottomSubNodeArgument));
                processNodeArgument(node, bottomSubNodeArgument, templateData);
                loopCount += 1;
            }
            node.scatteredSubNodesArgs = null;
            break;
        case NodeArgumentType.SLOT:
            // Register or update slot with new content
            node.slots[newArg[ArgumentKey.NAME]] = newArg[ArgumentKey.DATA] || null; // Optionally handle default content
            break;
        default:
            break;
    }
    return newArg
}



// // Global variables for managing active node arguments
// let activeNodeArgumentIndex = 0;
let activeNode = null;

// Helper function to check and push active node arguments
let activeNodeArgumentCheck = (nodeArg) => {
    if (activeNode&& activeNode.scatteredSubNodesArgs!==null ) {
        console.log("activeNodeArgumentCheck activeNode", activeNode);
        activeNode.scatteredSubNodesArgs.push(nodeArg);
    }
    return nodeArg;
};

// Helper functions to facilitate node creation
const text = (value, label = null) => activeNodeArgumentCheck([NodeArgumentType.TEXT, value, label]);
const attribute = (name, value) => [NodeArgumentType.ATTRIBUTE, name, value];
const onEvent = (event, listener) => [NodeArgumentType.EVENT, event, listener];
const content = (func) => [NodeArgumentType.CONTENT, func];
const slot = (name) => [NodeArgumentType.SLOT, name];
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
        state.clickCount === 1 ? text("You have clicked many times!") : null,
        content(() => {
            element("div", element("div", text(`last TAG Click me: ${state.clickCount}`)))
        })
    );
}

// Initialize node template and mount to DOM
let nodeTemplate = createNodeTemplate(null, mainTemplate);
const renderedElement = renderTemplate(nodeTemplate);
document.body.appendChild(renderedElement);
