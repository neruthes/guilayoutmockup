function sanitize_options(_options) {
    let options = { ..._options };
    // Supply default values
    options.style = _options.style || '';
    options.style += options.flex || 1 ? 'display: flex;' : '';
    options.style += options.grow ? `flex-grow: ${typeof options.grow === 'number' ? options.grow : 1};` : '';
    return options;
}



const hbox_vbox_default_style = `
border: 1px solid rgba(0,0,0,0.15);
border-radius: 3.5px;
padding: 6px;
`;



function card(_options, contents) {
    const options = sanitize_options(_options);
    return generic_postprocessor(options, `<div data-compmodel="card" style="
        ${options.style}
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.15) 0 1px 4px 0.25px;
    ">${contents.join('\n')}</div>`);
}
function vbox(_options, contents) {
    const options = sanitize_options(_options);
    return generic_postprocessor(options, `<div data-compmodel="vbox" style="
        ${hbox_vbox_default_style} ${options.style}
    ">${contents.map((x) => `<div style="display:flex; flex-grow: 1;">${x}</div>`).join('\n')}</div>`);
}
function hbox(_options, contents) {
    const options = sanitize_options(_options);
    return generic_postprocessor(options, `<div data-compmodel="hbox" style="
        ${hbox_vbox_default_style} ${options.style}
        display: flex; flex-direction: row;
    ">${contents.join('\n')}</div>`);
}
function canvas(_options, contents) {
    const options = sanitize_options(_options);
    return `
    <div style="padding: 100px 0px 15px;">${options.title || 'New Canvas'}</div>
    <div data-compmodel="canvas" style="
        width: 370px; height: 980px;
        overflow-x: hidden; overflow-y: scroll;
        border-radius: 7px;
        box-shadow: #DDDDDD 0px 3px 22px 1px;
        ${options.style}
    ">
        <div style="width: 390px; overflow-x: hidden; overflow-y: auto; padding: 10px;">
            ${contents.join('\n')}
        </div>
    </div>
    <div style="height: 40px;"></div>
    `;
};







function generic_postprocessor(_options, rendered) {
    // console.log('----------------\n[_options]');
    // console.log(_options);
    let new_rendered = rendered;
    if (_options.outer) {
        if (_options.outer instanceof Function) {
            // Use supplied function to wrap stuff
            console.log('// Use supplied function to wrap stuff');
            new_rendered = outer(new_rendered);
        }
        if (typeof _options.outer === 'string') {
            // Use builtin component to wrap
            console.log('// Use builtin component to wrap');
            new_rendered = exportable_functions[_options.outer]({}, [new_rendered]);
        }
        if (_options.outer instanceof Object) {
            if (
                _options.outer.comp
                && typeof _options.outer.comp === string
                && _options.outer.options
                && _options.outer.options instanceof Object
                && exportable_functions.hasOwnProperty(_options.outer.comp)
                && exportable_functions[_options.outer.comp] instanceof Function
            ) {
                // Sophisticated component calling
                new_rendered = exportable_functions[_options.outer](_options.outer.options || {}, [new_rendered]);
            }
        }
    }
    return new_rendered;
}


let exportable_functions = {
    canvas, card, vbox, hbox,

    h1(text) {
        return `<h1>${text}</h1>`;
    },
    h2(text) {
        return `<h2>${text}</h2>`;
    },
    h3(text) {
        return `<h3>${text}</h3>`;
    },

    label(text) { },
};

module.exports = {...exportable_functions,
    extras: {
        default_fancy_style: `* {box-sizing: border-box;}
        [data-compmodel="card"] > [data-compmodel="vbox"],
        [data-compmodel="card"] > [data-compmodel="hbox"] {
            border: none !important;
        }
        `
    }
};
