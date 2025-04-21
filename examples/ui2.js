import fs from 'fs';
import { createDocumentContext } from '../src/htmlcomponents.js';

const dc = createDocumentContext();

dc.define_macro("portablecss", () => dc._static.portable_css);
dc.define_macro("ending_js", () => dc._static.ending_js);

dc.define_macro("MegaContainer", (content) => `<div id="MegaContainer">
    <div id="MegaToc">
        <div>
            <h1>Table of Contents</h1>
            <div id="jsTocListView"></div>
        </div>
    </div>

    <div id="MegaList">${content}</div>
</div>`);


dc.define_macro("splash", (content, attrs) => `<div data-name="${attrs['data-name']}" class="splash">${content}</div>`);

dc.define_macro("uipage", (content) => `<div class="uipage">
    <div class="uipage-inner">
        ${content}
    </div>
</div>`);

dc.define_macro("sidenotes", (content) => `<div class="sidenotes">${content}</div>`);

dc.define_macro("GlobalTabBar", () => `<div style="text-align: center; display: grid; place-content: stretch; grid-template-columns: 70px 70px 70px 70px 70px;">
    <div>Home</div>
    <div>Shop</div>
    <div>Clients</div>
    <div>Tasks</div>
    <div>Me</div>
</div>`);





let html_input = fs.readFileSync(process.argv[2]).toString();
let html_output = dc.render(html_input);
fs.writeFileSync(process.argv[3], html_output);
