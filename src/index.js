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

//9.0

// import './a';
// import './b';
// import 'jquery';
// console.log('index')

// import React from 'react';   // 每次修改代码这些都会重新打包，降低性能
// import ReactDOM from 'react-dom';
//
//
// ReactDOM.render('1',window.root);

// dll 动态链接库
// react + reactDOM 先给你打包好 放好
// 引用的时候 引用我们打包好的结果即可


// let btn = document.createElement('button');
//
// btn.innerHTML = '点击';
// document.body.appendChild(btn);
// // vue lazyload react
// btn.addEventListener('click',function () {
//     // 需要babel插件来解析这个语法,返回的是一个promise
//     // jsonp
//      import('./test.js').then(data=>{
//             console.log(data.default)
//          })
// });


// react 懒加载

import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

// import User from './User';
// import Home from './Home';

class LazyLoad extends React.Component {
    constructor() {
        super();
        this.state = {
            com: null
        }
    }

    componentDidMount() {
        this.props.load().then(data => {  // 这个组件加载完成后更新状态
            this.setState({
                com: data.default
            })
        })
    }

    render() {
        let Com = this.state.com;
        return Com ? <Com {...this.props}></Com> : <div>加载中</div>

    }
}

// 刚开始应该渲染个空组件，当拿到东西后再把原组件替换
let Home = (props) => <LazyLoad {...props} load={() => import('./Home')}/>
let User = (props) => <LazyLoad {...props} load={() => import('./User')}/>

ReactDOM.render(
        <Router>
            <Switch>
                <Route path="/home" component={Home}></Route>
                <Route path="/user" component={User}></Route>
            </Switch>
        </Router>
        ,window.root);




// // 热更新模拟 实际是用websockt
//
// import React from 'react';
// import ReactDOM from 'react-dom';
//
// import User from './User';
// import Home from './Home';
//
//
// ReactDOM.render(
//    <div>
//        <User/>
//        <Home/>
//    </div>
//     ,window.root);
//
//
// if(module.hot){
//     module.hot.accept(['./Home'],()=>{
//         let Home = require('./Home').default;
//         let User = require('./User').default;
//         ReactDOM.render(<div>
//                 <User/>
//                 <Home/>
//             </div>
//             ,window.root)
//     })
// }
