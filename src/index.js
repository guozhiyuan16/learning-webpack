// import './reset.less';
// import './index.less';

// console.log('index');
//
// import 'bootstrap'

// let ace = require('./ace.jpeg');
// let img = new Image();
// img.src = ace;
//
// document.body.appendChild(img);


// class Persion {
//
//     getName(){
//         return n
//     }
// }
//
// let men = new Persion();
// console.log(men.getName());

// 本地发送的请求 不能指定端口（http://127.0.0.1:3000/api/user）会发生跨域

// 8080 /app/user => 3000/api/user  => http-proxy-middleware(webpack内置)

// let xhr = new XMLHttpRequest();
// xhr.open('GET','/api/user',true);
//
// xhr.onload = function () {
//     window.root.innerHTML = xhr.responseText;
//
//     console.log(xhr.response)
// }
//
// xhr.send();

// let url = "";
// if(DEV === 'development'){
//     url = '127.0.0.1'
// }else{
//     url = 'gzy'
// }
//
// console.log(url);
// console.log(DEV);
// console.log(EXPRESSION);
// console.log(FLAG);

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


// import moment from 'moment';
//
// import 'moment/locale/zh-cn';
//
// moment.locale('zh-cn');
//
// let r =  moment(Date.now()-60*1000*60*2).fromNow();
//
// console.log(r);


// //let calc = require('./calc');
//
// import calc from './calc';   // tree shaking   minus 就会被去掉
//
// console.log(calc.add() );


// let a = 1;
// let b = 2;
// let c = 3;
//
// let d = a+b+c;
// console.log(d);   // ===>  console.log(6)     // scope hosting


import './a';
import './b';
import 'jquery';
console.log('index')