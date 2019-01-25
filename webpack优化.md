## webpack中的优化

### 内置了一些优化 scope hosting(作用域提升) **导入，要使用import 语法**  、 tree shaking  (去除无用代码) **默认支持es6语法**，require他不会去分析依赖

### 配置 可以解决打包问题 需要自己配置

#### noParse
   
```angular2
    module :{
           noParse:/jquery/, // 如果确定没有依赖可以加载这里，不会去解析
           rules:[
               {
                   test:/\.css$/,
                   use:['style-loader','css-loader']
               },
           ]
       },
```
   
   
### 第三方插件

#### webpack.IgnorePlugin(内置)
```angular2
let webpack = require('webpack');
plugins:[
        new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果发现moment 中引入了local 就忽略掉(会把虽有的都忽略，所以js需要手动加载一下对应的语言包)
    ]
    
    
index.js    


import moment from 'moment';

import 'moment/locale/zh-cn'; // 会把虽有的都忽略，所以js需要手动加载一下对应的语言包

moment.locale('zh-cn');

let r =  moment(Date.now()-60*1000*60*2).fromNow();

console.log(r);
    
```

#### happyPack (多线程打包)

- npm install happypack --save-dev

[webpack优化之HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)

```angular2
let HappyPack = require('happypack');

module.exports = {
     module :{
            rules:[
                {
                    test:/\.css$/,
                    use:'HappyPack/loader?id=css'
    
                },
                {
                    test:/\.js$/,
                    use:'HappyPack/loader?id=js'
    
                }
            ]
        },
        plugins:[
            new HappyPack({
                id:'css',
                use:['style-loader','css-loader']
            }),
            new HappyPack({
                id:'js',
                use:[{   //  必须是数组
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env"],
                        "plugins":["@babel/plugin-proposal-class-properties"]
                    }
                }]
            }),
            new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果发现moment 中引入了local 就忽略掉(会把虽有的都忽略，所以js需要手动加载一下对应的语言包)
        ]
}

```

#### DllPlugin
[DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。](https://webpack.docschina.org/plugins/dll-plugin/)

```angular2

webpack.dll.js

let path = require('path');
let webpack = require('webpack');
module.exports = {
    mode:'development',
    entry:{
        react:['react','react-dom']     // 只要是第三方的都可以
    },
    output: {
        library:'[name]_dll',  // var xxx = 结果    拿到module.exports 的返回值,原来在闭包中拿不到
        filename: "_dll_[name].js",    // 输出的文件的名字随便起即可
        path: path.resolve(__dirname,'dist')
    },
    plugins: [
        new webpack.DllPlugin({
            name:'[name]_dll',  // name 是dll暴露的对象名，要跟 output.library 保持一致；
            path: path.resolve(__dirname,'dist','manifest.json')    // manifest.json 列出了打包模块中所有的东西
        })
    ]
};

npx webpack --config webpack.dll.js  --> 生成 react_dll动态链接库 ， 以及 manidest.json

```

```angular2

webpack.config.js
 
plugins:[
        new webpack.DllReferencePlugin({  //  dll 引用插件
            manifest: path.resolve(__dirname,'dist','manifest.json')  // 内部引用了react,react-dom 会先在manifest.json中寻找，找不到才会打包，找到的话通过此文件找全局下的react_dll这个变量，通过manifest.json中的id 拿到对应的值
        })
    ]


```



## question
- 动态链接库在生产环境可以使用？和第三方的模块打包有什么区别，动态链接库解决的是webpack打包时间和大小的问题？ 


