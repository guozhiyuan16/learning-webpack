## lazyload

- "@babel/plugin-syntax-dynamic-import"

### 懒加载执行步骤

```angular2
// index.js

let btn = document.createElement('button');

btn.innerHTML = '点击';
document.body.appendChild(btn);

// 点击这个按钮的时候实现懒加载
btn.addEventListener('click',function () {
    // 需要babel插件来解析这个语法,返回的是一个promise
    // jsonp
     import('./test.js').then(data=>{
            console.log(data.default)
         })
});

```

- 创建installedChunks来存储加载模块的信息

```angular2
 // undefined 标识模块没有加载
 // null 模块预加载
 // promise 模块加载中（加载中）
 // 0 模块加载完成
 var installedChunks = {
        "index": 0     // index 模块加载完成
    };
```

- 重写数组的push 方法 为 webpackJsonpCallback

```angular2

    // jsonpArray = []
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    // oldJsonpFunction 把原来数组的push 给保留一下
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    // 默认把当前数组的push方法重写了 
    jsonpArray.push = webpackJsonpCallback;
    ...

```

- 加载经过babel编译的index.js,调用__webpack_require__.e

```angular2
// 格式化后的index.js

btn.addEventListener('click', function () {

    // 加载入口文件 当点击时 会调用__webpack_require__.e
    // 默认加载0.js 就是懒加载的模块
    __webpack_require__.e(0)
        .then(__webpack_require__.bind(null, "./src/test.js"))
        .then(function (data) {
            console.log(data.default);
        })
});


```

- __webpack_require__.e 中 创建并且返回promise，修改installedChunks对象

```angular2
  var promises = [];
  
 var promise = new Promise(function (resolve, reject) {
     // {"main":0,0:[resolve,reject]}
     installedChunkData = installedChunks[chunkId] = [resolve, reject];
 });
     // installedChunks =  {"index":0,0:[resolve,reject,promise]}  把当前的promise 放到数组中
      promises.push(installedChunkData[2] = promise);

 ...
 
 return Promise.all(promises);   // e方法返回的Promise 成功

```

-  __webpack_require__.e 中 创建script 标签，绑定 onScriptComplete 事件，加载0.js

```angular2

  // script path function
      function jsonpScriptSrc(chunkId) {
          return __webpack_require__.p + "" + chunkId + ".index.js"   // __webpack_require__.p (publicPath) ,现在是""
      }

  var script = document.createElement('script');
  
   script.src = jsonpScriptSrc(chunkId);  // 加载0.js
   
   // 在执行成功前 会先执行0.js
   onScriptComplete = function (event) {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null;
        clearTimeout(timeout);  // 不在执行超时逻辑
        // {"main":0,0:[resolve,reject,promise]}
        var chunk = installedChunks[chunkId];
        if (chunk !== 0) {
               if (chunk) {
               var errorType = event && (event.type === 'load' ? 'missing' : event.type);
               var realSrc = event && event.target && event.target.src;
                var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                error.type = errorType;
                error.request = realSrc;
                 chunk[1](error);
         }
             installedChunks[chunkId] = undefined;
         }
    };
        var timeout = setTimeout(function () {
              onScriptComplete({type: 'timeout', target: script});
         }, 120000);
        script.onerror = script.onload = onScriptComplete;
         document.head.appendChild(script);

```

- 加载0.js时，会调用重写的push方法(webpackJsonpCallback),把后加载的结构合并到modules

```angular2

    function webpackJsonpCallback(data) {
        var chunkIds = data[0];   // [0]
        var moreModules = data[1];   //{ "./sec/test.js",.... }


        // add "moreModules" to the modules object,   // 希望吧后加载的模块加载到modules对象上
        // then flag all "chunkIds" as loaded and fire callback
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (installedChunks[chunkId]) {   // {0:[resolve,reject,promise]}
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;   //{0:0}
        }
        for (moduleId in moreModules) { // 吧后加载的模块放到modules中
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);

        while (resolves.length) {
            resolves.shift()();   // 让promise 变成成功态
        }

    };

```

- 合并后调用 当前 __webpack_require__.e方法的promise成功

- 可以引用到后加载的模块，取到最终的结果


### react路由懒加载（高阶组件）
先加载原有的模块 之后 向模块中添加

- User.js、Home.js

```angular2
import React,{Component} from 'react';
import ReactDom from 'react-dom';

export default class User extends Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div>
                User
            </div>
        )
    }
}
```

- index.js
```angular2
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

// 刚开始应该渲染个空组件，当拿到东西后再把原组件替换props 记得需要传递
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

```

### 热更新模拟
每次有代码更改会提交给浏览器 浏览器会用最新的模块替换掉原有的模块，出发最终的回调函数
```angular2
// 热更新

import React from 'react';
import ReactDOM from 'react-dom';

import User from './User';
import Home from './Home';


ReactDOM.render(
   <div>
       <User/>
       <Home/>
   </div>
    ,window.root);


if(module.hot){  // 热更新
    module.hot.accept(['./Home'],()=>{
        let Home = require('./Home').default;
        let User = require('./User').default;
        ReactDOM.render(<div>
                <User/>
                <Home/>
            </div>
            ,window.root)
    })
}
```