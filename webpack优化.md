## webpack中的优化

### 内置了一些优化 scope hosting(作用域提升)  、 tree shaking  (去除无用代码)

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