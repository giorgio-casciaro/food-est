/**
 * @file index.js
 * @description This file contains the implementation of a more complex UI component system using observable state and HTML element generation functions.
 * @version 0.0.2
 */

import { observable} from './observable.js';
import { tag, component, HtmlElementProps, ComponentHtmlElementProps } from './HtmlElementProps.js';

// Child Component
function TestComponentChild(componentHtmlElementProps) {
    console.log('TestComponentChild rendered',componentHtmlElementProps);

    /**
     * @return {HtmlElementProps} The generated element.
     */
    function generate() {
        return tag("div")
            .addChild("Child component: ")
            .addChild(componentHtmlElementProps.params.name)
            .setChildren(componentHtmlElementProps.params.children);
    }

    let htmlElementProps = generate() 
    let htmlElement = htmlElementProps.createHTMLElement()
    return htmlElement;
}

// List Item Component
function ListItemComponent(componentHtmlElementProps) {
    console.log('ListItemComponent rendered',componentHtmlElementProps);

    /**
     * @return {HtmlElementProps} The generated element.
     */
    function generate() {
        return tag("li")
            .setText(componentHtmlElementProps.params.itemName);
    }
    let htmlElementProps = generate() 
    let htmlElement = htmlElementProps.createHTMLElement()
    return htmlElement;
}

// Main Component
function TestComponent(params) {
    console.log('TestComponent rendered');
    const state = observable({
        list: [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }],
        name: "Task Manager",
        showLoading: true,
        counter: 0,
        efficientCounter: 0
    });

    /**
     * @return {HtmlElementProps} The generated element.
     */
    
    let htmlElementProps = new HtmlElementProps()
    htmlElementProps.template = (setTag) => {
            setTag("div")
            .addChild(tag("h1").setText(state.showLoading ? "LOADING" : state.name))
            .addChild(tag("input").setAttr("value",state.name).setEvent("input", (event) => {
                console.log("event",event)
                const cursorPosition = event.target.selectionStart;
                state.name = event.target.value;
                requestAnimationFrame(()=>{
                    event.target.focus();
                    event.target.setSelectionRange(cursorPosition, cursorPosition);
                });
            }).setLabel("input"))
            .addChild(component(TestComponentChild).setParams({ name: state.name, children: [tag("span").setText(" - This is a child component.")] }))
            .addChild(tag("button").setText("Increment Counter").setEvent("click", () => {
                state.counter += 1;
            }))
            .addChild(tag("p").setText(`Counter: ${state.counter}`))
            .addChild(tag("button").setText("Increment List").setEvent("click", () => {
                state.list.push({ name: `Item ${state.list.length + 1}` });
                state.list = state.list
            }))
            .addChild(tag("ul").setChildren(
                state.list.map((item, index) => component(ListItemComponent).setParams({ itemName: item.name }).setLabel(`listItem${index}`))
            ))
            .addChild(tag("p").setText(`Efficient Counter: ${state.efficientCounter}`).setLabel("efficientCounter"))
            .addChild(tag("button").setText("Efficient Increment Counter").setEvent("click", () => {
                state.efficientCounter += 1;
            }));
    }


    // Observing changes
    state.$onSet(["name", "showLoading", "counter", "list"], () => {
        console.log('TestComponent state changed',htmlElementProps);
        htmlElementProps.updateHtmlElement();
    });
    // Observing changes
    state.$onSet(["efficientCounter"], () => {
        console.log('TestComponent state changed efficientCounter',htmlElementProps.labeledElements);
        htmlElementProps.labeledElements.efficientCounter.element.innerHTML = `Efficient Counter: ${state.efficientCounter}`;
    });

    // Simulating state change
    // setTimeout(() => {
    //     state.showLoading = false;
    //     state.list.push({ name: "Item 4" });
    // }, 2000);

    return htmlElementProps.createHTMLElement();
}

document.body.appendChild(TestComponent());
