
// Manipulate DOM
document.querySelector('#MegaToc').innerHTML += `<h1>${document.title}</h1><div id="jsTocListView"></div>`;
document.querySelectorAll('.Page').forEach((element) => {
    element.innerHTML = `<div class="uipage-inner">${element.innerHTML}</div>`;
});


let splash_ptr_heap = 0;

let toc_data_arr = [];
document.querySelectorAll('.Splash').forEach((element) => {
    let splash_id = element.getAttribute("id");
    if (!element.getAttribute("id")) {
        splash_id = 'splash_id_' + splash_ptr_heap;
        element.setAttribute('id', splash_id);
    };
    splash_ptr_heap += 1;
    let full_name = element.getAttribute("data-name");
    let cat_name = '(misc)';
    let page_name = full_name;
    if (full_name.indexOf(' / ') > 0) {
        cat_name = '' + full_name.split(' / ')[0];
        page_name = full_name.split(' / ').slice(1).join(' / ');
    }
    let entry_obj = { page_name, splash_id };
    if (toc_data_arr.length === 0) {
        // First category
        toc_data_arr.push({ cat_name, entries: [entry_obj] });
    } else {
        // Compare and insert
        const last_ref = toc_data_arr[toc_data_arr.length - 1];
        if (last_ref.cat_name === cat_name) {
            last_ref.entries.push(entry_obj);
        } else {
            toc_data_arr.push({ cat_name, entries: [entry_obj] });
        };
    }
});
document.getElementById('jsTocListView').innerHTML = toc_data_arr.map(function (category) {
    return `<div style="border-radius: 5px; border: 1px solid #CCCCCC; padding: 8px;">
        <h2 style="margin: 0px 0px 5px;">${category.cat_name}</h2>
        ${category.entries.map(function (entry) {
        return `<div>
                <a style="font-size: 1.2rem;" class="toc_entry_splash" href="#${entry.splash_id}">${entry.page_name}</a>
            </div>`;
    }).join('\n')}
    </div>`
}).join('\n');



// Macro expansion
// for (let recur = 0; recur < 15; recur += 1) {
//     document.querySelectorAll('[use-macro]').forEach((element) => {
//         let macro_name = element.getAttribute("use-macro");
//         let macro_def = document.querySelector(`[macro-for="${macro_name}"]`);
//         if (macro_def instanceof Element) {
//             element.outerHTML = macro_def.innerHTML;
//         };
//     });
// };


// Better macro expansion?
for (let recur = 0; recur < 15; recur += 1) {
    document.querySelectorAll('[use-macro]').forEach((element) => {
        const macroName = element.getAttribute("use-macro");
        const macroDef = document.querySelector(`[macro-for="${macroName}"]`);

        if (macroDef instanceof Element) {
            // Create a temporary container to safely manipulate innerHTML
            const temp = document.createElement("div");
            temp.innerHTML = macroDef.innerHTML;

            // Apply inheritance from the macro caller to the macro body
            temp.querySelectorAll('[inherit]').forEach((targetEl) => {
                const inheritPairs = targetEl.getAttribute("inherit").trim().split(/\s+/);

                inheritPairs.forEach(pair => {
                    const [targetAttr, sourceAttr] = pair.split(":");
                    if (targetAttr && sourceAttr && element.hasAttribute(sourceAttr)) {
                        targetEl.setAttribute(targetAttr, element.getAttribute(sourceAttr));
                    }
                });

                targetEl.removeAttribute("inherit"); // Optional cleanup
            });

            // Replace the original element with the expanded and inherited macro content
            element.outerHTML = temp.innerHTML;
        }
    });
};

document.querySelectorAll(`[innerhtml]`).forEach(function (node) {
    node.innerHTML = node.getAttribute('innerhtml');
});







function on_hash_change() {
    let new_hash = location.hash;
    console.log(`new_hash: ${new_hash}`);
    document.querySelectorAll(`#jsTocListView .toc_entry_splash`).forEach(function (node) {
        node.setAttribute('data-is-current', node.getAttribute('href') === new_hash ? 'true' : 'false');
    });
}
window.addEventListener('hashchange', on_hash_change);
on_hash_change();

window.addEventListener('resize', function () {
    if (document.querySelector(location.hash)) {
        console.log('document.querySelector(location.hash)');
        console.log(document.querySelector(location.hash));
        document.querySelector(location.hash).scrollIntoView({ behavior: 'instant', block: 'start' });
    };
});

