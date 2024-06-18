

element("div", { href: "test", click: () => { }, style: { display: "block" } }, () => {
    text("test")
})
element("div", { href: "test", click: () => { } }, { display: "block" }, () => {
    text("test")
})
element("div", attr("href", "test"), on("click", () => { }), css("display","block"), () => {
    text("test")
})
div(attrHref("test"), onClick(() => { }), cssDisplay("block"), () => {
    text("test")
})
div({href:"test", onclick:() => { }, style:{ display:"block" }}, () => {
    text("test")
})
div(attr.href("test"), on.click(()=>{}), css.display("block"), () => {
    text("test")
})
element("div", attr("href", "test"), on("click", () => { }), css("display", "block"), () => {
    text("test")
});

element("div", div => {
    attr("href", "test")
    on("click", () => { })
    css("display", "block")
    text("test")
});
element("div",
    attribute("class", "container"),
    text(state.title),
    element("button",
        text(`Click me: ${state.clickCount}`),
        onEvent("click", () => {
            state.clickCount++;
            // renderTemplate(nodeTemplate); // Re-render to reflect state changes
        })
    ),
    state.clickCount > 5 ? text("You have clicked many times!") : null,
    () => {
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
    }
);