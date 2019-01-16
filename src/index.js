import './reset.less';
import './index.less';

console.log('index');

let ace = require('./ace.jpeg');
let img = new Image();
img.src = ace;

document.body.appendChild(img);

// let str = require('./a');
// require('./index.css');
// console.log(str);
//
//
//
// class Person{
//     a = 1;
//     getName(){
//         return name
//     }
// }
//
// let p = new Person();
//
// p.getName();
//
// let fn = ()=>{
//     console.log(1111)
// };
//
// fn();