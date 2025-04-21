import fs from 'fs';
import { createDocumentContext } from '../src/htmlcomponents.js';

const dc = createDocumentContext();

dc.define_macro("portablecss", (content) => dc._static.portable_css);

dc.define_macro("MegaContainer", (content) => `<div id="MegaContainer">
    <div id="MegaToc">
        <div>
            <div>TOC HERE</div>
            <div id="jsTocListView"></div>
        </div>
    </div>

    <div id="MegaList">${content}</div>
</div>`);


dc.define_macro("splash", (content, attrsObject) => `<div class="splash">${content}</div>`);

dc.define_macro("uipage", (content) => `<div class="uipage">
    <div class="uipage-inner">
        ${content}
    </div>
</div>`);

dc.define_macro("sidenotes", (content) => `<div class="sidenotes">${content}</div>`);





let html_input = fs.readFileSync(process.argv[2]).toString();
let html_output = dc.render(html_input);
fs.writeFileSync(process.argv[3], html_output);
