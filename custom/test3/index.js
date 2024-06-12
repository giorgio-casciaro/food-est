/**
 * @file index.js
 * @description This file contains the implementation of a more complex UI component system using observable state and HTML element generation functions.
 * @version 0.0.2
 */

const T_TXT = 0
const T_ATTR = 1
const T_EVENT = 2
const T_CONTENT = 3
const T_SLOT = 4
const T_NODE = 5

const A_TYPE = 0
const A_TEXT_VALUE = 1
const A_TEXT_DOM = 2
const A_NAME = 1
const A_VALUE = 2
const A_NODE_TAG = 1
function createNodesTemplate(parent, template) {
    let nodesTemplate = {
        dinamicNode: createDinamicNode(parent),
        template: template,
        slots: {},
    }
    return nodesTemplate
}
function renderNodesTemplate(nodesTemplate) {
    let templateRootNode = nodesTemplate.template()
    renderNode(nodesTemplate, nodesTemplate.dinamicNode, templateRootNode)
    return nodesTemplate.dinamicNode.element
}
function createDinamicNode(parent) {
    let dinamicNode = {
        domElement: null,
        parent: parent,
        children: {},
        tagName: null,
        nodeArguments: []
    }
    return dinamicNode
}
function renderNode(nodesTemplate, dinamicNode, templateNode) {
    console.log("renderNode", {nodesTemplate, dinamicNode, templateNode})
    console.log("renderNode args", JSON.stringify(templateNode))
    if (dinamicNode.tagName !== templateNode[A_NODE_TAG]) {
        const domElement = document.createElement(templateNode[A_NODE_TAG]);
        if (dinamicNode.parent) {
            if (dinamicNode.domElement) {
                dinamicNode.parent.domElement.replaceChild(domElement, dinamicNode.domElement)
            } else {
                dinamicNode.parent.domElement.appendChild(domElement)
            }
        }
        dinamicNode.domElement = domElement
    }
    dinamicNode.tagName = templateNode[A_NODE_TAG]
    for (let i = 2; i < templateNode.length; i++) {
        let newArg = templateNode[i]
        if (typeof newArg === "string") {
            newArg = text(newArg)
        } else if (typeof newArg === "function") {
            newArg = contents(null, newArg)
        }
        let oldArg = dinamicNode.nodeArguments[i]
        let isNew = oldArg === null || typeof oldArg === "undefined"
        
        if (newArg === null) {
            if (!isNew && oldArg) {
                //ARGUMENT REMOVED
                if (oldArg[A_TYPE] === T_TXT) {
                    //TEXT CONTENTS
                    dinamicNode.domElement.removeChild(oldArg[A_TEXT_DOM])
                    dinamicNode.children[i]=null
                }
                else if (oldArg[A_TYPE] === T_ATTR) {
                    //ATTRIBUTE
                    dinamicNode.domElement.removeAttribute(oldArg[1])
                } else if (oldArg[A_TYPE] === T_EVENT) {
                    //EVENT
                } else if (oldArg[A_TYPE] === T_NODE) {
                    console.log("REMOVE NODE", dinamicNode, oldArg)
                    //NODE
                    dinamicNode.domElement.removeChild(dinamicNode.children[i].domElement)
                    dinamicNode.children[i] = null

                } else if (oldArg[A_TYPE] === T_CONTENT) {
                    //CONTENT
                }
            }
        } else if (newArg[A_TYPE] === T_TXT) {
            //TEXT CONTENTS
            console.log("ADD TEXT", newArg, oldArg, dinamicNode)
            if (isNew) {
                let textNode = document.createTextNode(newArg[A_TEXT_VALUE]);
                dinamicNode.domElement.appendChild(textNode)
                dinamicNode.children[i]=textNode
            }
            else if (oldArg[A_TEXT_VALUE] !== newArg[A_TEXT_VALUE]) {
                dinamicNode.children[i].nodeValue = newArg[A_TEXT_VALUE]
            }
        } else if (newArg[A_TYPE] === T_ATTR) {
            //ATTRIBUTE
            if (isNew || oldArg[A_VALUE] !== newArg[A_VALUE]) {

                dinamicNode.domElement[newArg[A_NAME]] = newArg[A_VALUE]
            }
        } else if (newArg[A_TYPE] === T_EVENT) {
            //EVENT
            if (isNew || oldArg[A_VALUE] !== newArg[A_VALUE]) {
                dinamicNode.domElement[newArg[A_NAME]] = newArg[A_VALUE]
            }
        } else if (newArg[A_TYPE] === T_NODE) {
            console.log("ADD NODE", newArg, oldArg, dinamicNode)
            //NODE
            if (isNew) {
                let childDinamicNode = createDinamicNode(dinamicNode)
                renderNode(nodesTemplate, childDinamicNode, newArg)
                dinamicNode.children[i]=childDinamicNode
            }else{
                renderNode(nodesTemplate, dinamicNode.children[i], newArg)
            }
        } else if (newArg[A_TYPE] === T_CONTENT) {
            //CONTENTS
            if (isNew) {
                let nodeArgument = dinamicNode.nodeArguments[i]
                let isNew = typeof nodeArgument === "undefined"
                function addChild() {
                    let childDinamicNode = createDinamicNode(dinamicNode, null)
                    renderNode(childDinamicNode, ...arguments)
                }
                newArg[A_VALUE](addChild)
            }
        }
        // if (isNew) {
            dinamicNode.nodeArguments[i] = newArg
        // }
    }
}

// function renderDinamicNode(dinamicNode) { 
//     function tag(){
//         renderNode(dinamicNode, ...arguments)
//     }
//     dinamicNode.template(tag)
//     return dinamicNode.element
// }

function text(value) {
    return [T_TXT, value]
}
function attr(attrName, attrValue) {
    return [T_ATTR, attrName, attrValue]
}
function on(eventName, eventListener) {
    return [T_EVENT, eventName, eventListener]
}
function contents(slotName, contentsFunction) {
    return [T_CONTENT, slotName, contentsFunction]
}
function slot(slotName) {
    return [T_SLOT, slotName]
}
function node(tagName) {
    return [T_NODE, ...arguments]
}
let state = {
    testName: "name",
    testCondition: true
}

// let template = () => node("div", attr("href", "value"), attr("title", "value"), on("click", event => { }), text(state.testName), text(state.testName) , () => {
//     node("div", node => {
//         node("h3", "content")
//     })
//     node("div", node("h3", "content"), node("h4", "content"))
//     node("div", [node("h3", "content"), node("h4", "content")])
//     node("h3", "content")
//     node("h4", "content")
// })
let template = () => node("div", attr("href", "value"), attr("title", "value"), on("click", event => { }), text(state.testName), text(state.testName), node("div", node("h3", "content"), node("h4", "content",text(state.testName))), state.testName === null ? node("div","no name") : null,state.testName === null ? null : node("div","yes name") , node("div", [node("h3", "content"), node("h4", "content")]))
let nodesTemplate = createNodesTemplate(null, template)
renderNodesTemplate(nodesTemplate)
console.log(nodesTemplate)
document.body.appendChild(nodesTemplate.dinamicNode.domElement)
setTimeout(() => {
    state.testName = null
    renderNodesTemplate(nodesTemplate)
    console.log(nodesTemplate)
    setTimeout(() => {
        state.testName = "name2"
        renderNodesTemplate(nodesTemplate)
        console.log(nodesTemplate)
    },3000)
},3000)
