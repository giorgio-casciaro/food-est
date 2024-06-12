/**
 * @file index.js
 * @description This file contains the implementation of a more complex UI component system using observable state and HTML element generation functions.
 * @version 0.0.2
 */

import { observable } from './observable.js';
import { tag } from './HtmlElementProps.js';

// let domtag = tag("div").addChild("Hello World").addChild()
let domtag = tag("div")
    .addChild("H1", c => c.addChild("div", "Hello World"))
    .addChild("H1", "Hello World")
    .addChild(tag => "Hello World")
    .addChild(tag => tag("a")
        .addChild("Hello World"))

// let domtag2 = tag("a")("href", "value")("title", "value")("on","click", () => { })("stylename", cssPx("value"))(child => child("h2")("content"))
// let domtag3 = tag("a", ["href", "value"], ["title", "value"], ["on","click", () => { }], "Content", child => child("h2")("content"))
// let domtag4 = tag("a", attr("href", "value"), attr("title", "value"), on("click", () => { }), tag => {
//     tag("h2","content")
//     tag("if", condition(() => { }),tag=>{

//     })
//     tag("h3","content")
//     tag("h4","content")
// })
// let domtag5 = tag("a", "href", "=", "test", "title", "=", "test", "click" , "=", ()=>{}, ">", child=>child("h2")("content") ) 
// let domtag6 = tag("a", "href", "=", "test", "title", "=", "test", "click" , "=", ()=>{}).content(addChild=>{

// })
console.log(domtag.element)
