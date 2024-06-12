/**
 * @file index.js
 * @description This file contains the implementation of a more complex UI component system using observable state and HTML element generation functions.
 * @version 0.0.2
 */

const T_TXT = 0
const T_ATTR = 1
const T_EVENT = 2
const T_CONTENT = 3
const T_SLOT = 3

const A_TYPE = 0
const A_TEXT_VALUE = 1
const A_TEXT_DOM = 2
const A_NAME = 1
const A_VALUE = 2
function createNodesTemplate(parent, template) {
    let nodesTemplate = {
        dinamicNode: createDinamicNode(parent),
        template : template,
        slots: {},
    }
    return nodesTemplate
}
function renderNodesTemplate(nodesTemplate) {
    function tag(){ renderNode(nodesTemplate.dinamicNode, ...arguments) }
    nodesTemplate.template(tag)
    return nodesTemplate.dinamicNode.element
}
function createDinamicNode(parent) {
    let dinamicNode = {
        domElement: null,
        parent: parent,
        tagName: null,
        nodeArguments: []
    }
    return dinamicNode
}
function renderNode (dinamicNode,tagName){
    console.log("renderNode tag", arguments)
    if (dinamicNode.tagName !== tagName) {
        const domElement = document.createElement(tagName);
        if (dinamicNode.parent) {
            if (dinamicNode.domElement) {
                dinamicNode.parent.domElement.replaceChild(domElement, dinamicNode.domElement)
            } else {
                dinamicNode.parent.domElement.appendChild(domElement)
            }
        }
        dinamicNode.domElement = domElement
    }
    dinamicNode.tagName = tagName
    console.log("renderNode tag", dinamicNode.tagName, )
    for (let i = 2; i < arguments.length; i++) {
        let fnArgument = arguments[i]
        if (typeof fnArgument === "string") {
            fnArgument = text(fnArgument)
        } else if (typeof fnArgument === "function") {
            fnArgument = contents(null, fnArgument)
        }
        let nodeArgument = dinamicNode.nodeArguments[i]
        let isNew = typeof nodeArgument === "undefined"
        if (fnArgument === null) {
            if(!isNew){
                //ARGUMENT REMOVED
                if (typeof nodeArgument === "function") {
                    //CONTENTS
                } else if (nodeArgument[A_TYPE] === T_TXT) {
                    //TEXT CONTENTS
                    nodeArgument[1] = null
                    nodeArgument[2].nodeValue=""
                }
                else if (nodeArgument[A_TYPE] === T_ATTR) {
                    //ATTRIBUTE
                    nodeArgument[2] = null
                    dinamicNode.domElement.removeAttribute(nodeArgument[1])
                } else if (nodeArgument[A_TYPE] === T_EVENT) {
                    //EVENT
                } else if (nodeArgument[A_TYPE] === T_CONTENT) {
                    //CONTENT
                }
            }
        }else if (fnArgument[A_TYPE] === T_TXT) {
            //TEXT CONTENTS
            if (isNew) {
                let textNode = document.createTextNode(fnArgument[A_TEXT_VALUE]);
                dinamicNode.domElement.appendChild(textNode)
                fnArgument[A_TEXT_DOM] = textNode
            }
            else if (nodeArgument[A_TEXT_VALUE] !== fnArgument[A_TEXT_VALUE]) {
                nodeArgument[A_TEXT_DOM].nodeValue = nodeArgument[A_TEXT_VALUE] = fnArgument[A_TEXT_VALUE]
            }
        } else if (fnArgument[A_TYPE] === T_ATTR) {
            console.log("ATTRIBUTE",dinamicNode,fnArgument[A_VALUE])
            //ATTRIBUTE
            if (isNew || nodeArgument[A_VALUE] !== fnArgument[A_VALUE]) {
                
                dinamicNode.domElement[fnArgument[A_NAME]] = fnArgument[A_VALUE]
            }
        } else if (fnArgument[A_TYPE] === T_EVENT) {
            //EVENT
            if (isNew || nodeArgument[A_VALUE] !== fnArgument[A_VALUE]) {
                dinamicNode.domElement[fnArgument[A_NAME]] = fnArgument[A_VALUE]
            }
        } else if (fnArgument[A_TYPE] === T_CONTENT) {
            //CONTENTS
            if (isNew) {
                let nodeArgument = dinamicNode.nodeArguments[i]
                let isNew = typeof nodeArgument === "undefined"
                function addChild(){
                    let childDinamicNode = createDinamicNode(dinamicNode, null)
                    renderNode(childDinamicNode, ...arguments)
                }
                fnArgument[A_VALUE](addChild)
            }
        } 
        if (isNew) {
            dinamicNode.nodeArguments[i] = fnArgument
        }
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
let state = {
   testName : "name",
   testCondition : true
}

let template = node => node("div", attr("href", "value"), attr("title", "value"), on("click", event => { }), text(state.testName), text(state.testName) , node => {
    node("div", node => {
        node("h3", "content")
    })
    // node("div", node("h3", "content"), node("h4", "content"))
    // node("div", [node("h3", "content"), node("h4", "content")])
    node("h3", "content")
    node("h4", "content")
})
let nodesTemplate = createNodesTemplate(null, template)
renderNodesTemplate(nodesTemplate)
console.log(nodesTemplate)
document.body.appendChild(nodesTemplate.dinamicNode.domElement)
// setTimeout(() => {
//     state.testName = null
//     renderDinamicNode(dinamicNode)
//     console.log(dinamicNode)
//     setTimeout(() => {
//         state.testName = "name2"
//         renderDinamicNode(dinamicNode)
//         console.log(dinamicNode)
//     },3000)
// },3000)
