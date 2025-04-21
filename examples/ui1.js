// import * as GUI from '../src/functions';
// import { canvas, hbox, vbox, label, h1, h2, h3 } from '../src/functions.js';


import fs from 'fs';
import pkg from '../src/functions.js';
const { extras, canvas, hbox, vbox, label, h1, h2, h3 } = pkg;


let canvas_arr = [];




// canvas_arr.push(canvas({title: 'Example Canvas'}, [
//     vbox({outer:'card'}, [
//         // label('Title'),
//         h1('Title'),
//         '114514',
//         hbox({}, [
//             '114514',
//             '114514',
//             '114514',
//         ]),
//         '114514',
//         '114514',
//         '114514',
//     ]),
// ]));


canvas_arr.push(canvas({title: 'Tab Bar', flex: true, grow: true}, [
    vbox({}, [
        h1('Title'),
        '114514',
    ]),
    vbox({flex: true, grow: true}, [1]),
    vbox({flex: true, grow: true}, [2]),
    hbox({}, [
        // h2('Tab1'),
        // h2('Tab2'),
        // h2('Tab3'),
        // h2('Tab4'),
        // h2('Tab5'),
        vbox({flex:1,grow:1},[h2('Tab1')]),
        vbox({flex:1,grow:1},[h2('Tab2')]),
        vbox({flex:1,grow:1},[h2('Tab3')]),
        vbox({flex:1,grow:1},[h2('Tab4')]),
        vbox({flex:1,grow:1},[h2('Tab5')]),
    ]),
]));



let output_html = `
<html>
<head>
<style>
${extras.default_fancy_style}
</style>
</head>

<body>
<div style="width: 400px; margin: 100px auto;">
${canvas_arr}
<div>
</body>

</html>
`;


// console.log(output_html);

fs.writeFileSync('examples/ui1.js.html', output_html);
