import { h, render, Component } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import AppUser from './AppUser.js';
import './typedef.js';


// Initialize htm with Preact
const html = htm.bind(h);
function appBg(block) {
    block()
        .then(() => { console.log("appBg then") })
        .catch((error) => { console.log("appBg catch error", error) })
}


function UiAppPageLoading(props) {
    console.log("appPageLoading", props)
    return html`<div>appPageLoading</div>`;
}
function UiAppPageProducts({ app }) {
    console.log("UiAppPageProducts")
    return html`<div>${JSON.stringify(app.appFileData.data.products)}</div>`;
}
function UiAppPageCategories({ app }) {
    console.log("UiAppPageCategories")
    return html`<div>${JSON.stringify(app.appFileData.data.categories)}</div>`;
}
function UiAppPageLogin(props) {
    console.log("UiAppPageLogin", props)
    return html`<div>UiAppPageLogin</div>`;
}
function UiAppPageInit(props) {
    console.log("appPageInit", props)
    return html`<div>appPageInit</div>`;
}
function UiAppHeader({ app }) {
    return html`<div>
        <a onClick=${() => app.setAppPage('LOGIN')} >Login</a>
        <a onClick=${() => app.setAppPage('PRODUCTS')} >Products</a>
        <a onClick=${() => app.setAppPage('CATEGORIES')} >Categories</a>
        </div>`;
}
function UiAppFooter({ setAppPage }) {
    return html`<div>Footer</div>`;
}
function UiAppPageSwitch(props) {
    let appPage = props.app.appPage
    console.log("UiAppPageSwitch", appPage)
    if (appPage == "LOADING") return UiAppPageLoading(props)
    else if (appPage == "LOGIN") return UiAppPageLogin(props)
    else if (appPage == "PRODUCTS") return UiAppPageProducts(props)
    else if (appPage == "CATEGORIES") return UiAppPageCategories(props)
    return UiAppPageInit(props)
}
function UiApp(props) {
    const [appState, setAppState] = useState("INIT");
    const [appPage, setAppPage] = useState("LOADING");
    const [appFileData, setAppFileData] = useState({});
    async function save() {

    }
    async function reset() {
        // let newAppFileData = Object.assign({},appFileData,{ menu: { products: [], categories: [] }})
        let newAppFileData = Object.assign(
            {},
            appFileData,
            {
                data: {
                    products: [
                        {id:0,name:"test",price:"test",description:"test",ingridients:"test",category:0}
                    ], 
                    categories: [
                        {id:0,name:"test",price:"test",description:"test"}
                    ]
                }
            }
        )
        setAppFileData(newAppFileData)
    }
    useEffect(() => {
        console.log("UiAppPageSwitch useEffect")
        let token = AppUser.getToken()
        appBg(async () => {
            let fileData = await AppUser.fetchFile(token);
            console.log("UiAppPageSwitch fetchFile fileData", fileData)
            setAppFileData(fileData)
        })
        return () => {
            // Optional: Any cleanup code
            console.log("UiAppPageSwitch useEffect cleanup", appPage)
        };
    }, []);
    let app = { appPage, setAppPage, appFileData, setAppFileData }
    return html`<div>
        ${UiAppHeader({ app })}
        ${UiAppPageSwitch({ app })}
        ${UiAppFooter({ app })}
        <a onClick=${save} >SAVE</a>
        <a onClick=${reset} >RESET</a>
        </div>
        `;
}
render(html`<${UiApp} />`, document.body);