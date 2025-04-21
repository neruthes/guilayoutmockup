// document-context.js
import { JSDOM } from "jsdom";

export class DocumentContext {
    static #instance = null;

    // static _static = {
    //     portable_css: `<style>*{color:red;}</style>`
    // };

    constructor() {
        if (DocumentContext.#instance) {
            return DocumentContext.#instance;
        }
        this.macros = new Map();
        this._static = {
            portable_css: `<style></style>`,
            ending_js: `<script>
                let splash_ptr_heap = 0;
                document.querySelectorAll('.splash').forEach((element) => {
                    element.setAttribute('id', 'splash_id_'+splash_ptr_heap);
                    document.getElementById('jsTocListView').innerHTML += '<div>' +
                        '<a class="toc_entry_splash" href="#splash_id_' + splash_ptr_heap + '">' + element.getAttribute("data-name") + '</a>' +
                    '</div>';
                    splash_ptr_heap += 1;
                });
            </script>`,
        };
        DocumentContext.#instance = this;
    }

   
    define_macro(name, transformer) {
        this.macros.set(name.toLowerCase(), transformer);
    }

    render(inputString) {
        // const wrappedHTML = `<macro-root>${inputString}</macro-root>`;
        const wrappedHTML = inputString;
        const dom = new JSDOM(wrappedHTML, { contentType: "application/xml" });
        const doc = dom.window.document;
        const root = doc.documentElement;

        const expandNode = (node) => {
            const { Node } = dom.window;

            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return "";
            }

            const tagName = node.tagName;
            const transformer = this.macros.get(tagName.toLowerCase());

            let innerHTML = "";
            for (const child of node.childNodes) {
                innerHTML += expandNode(child);
            }

            if (transformer) {
                const attrsObject = Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]));
                return transformer(innerHTML, attrsObject);
            } else {
                const attrs = [...node.attributes]
                    .map(attr => ` ${attr.name}="${attr.value}"`)
                    .join("");
                return `<${tagName}${attrs}>${innerHTML}</${tagName}>`;
            }
        };

        let result = "";
        for (const child of root.childNodes) {
            result += expandNode(child);
        }

        return `<!DOCTYPE html><html>${result}</html>`;
    }
}

export function createDocumentContext() {
    return new DocumentContext();
}
