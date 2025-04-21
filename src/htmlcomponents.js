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
            portable_css: `<style></style>`
        };
        DocumentContext.#instance = this;
    }

   
    define_macro(name, transformer) {
        this.macros.set(name.toLowerCase(), transformer);
    }

    render(inputString) {
        const wrappedHTML = `${inputString}`;
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

            const tagName = node.tagName.toLowerCase();
            const transformer = this.macros.get(tagName);

            let innerHTML = "";
            for (const child of node.childNodes) {
                innerHTML += expandNode(child);
            }

            if (transformer) {
                return transformer(innerHTML, node);
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
