## webpack常用配置

### 初始化
```
yarn init -y
```

### 安装 (本地安装，不要安装到全局，有可能版本有差别)

```
yarn add webpack webpack-cli -D
```

### entry
```
 entry:'./src/index.js',   // 单入口
 or
 entry:{    、、 多入口
    main:'./src/index.js'
    ...
 }
 
```

### output
```
output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:8].js' // 根据摘要算法每次产生不同的hash，防止缓存，当你内容没有变化时，不会发生变化
    },
```

### mode

- development 调试（不会压缩，不会调试）
```
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

- production
```
module.exports = {—
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```

### loader(转化代码)
- loader特性：简单，单一

- loader执行顺序: 从上到下，从左到右

- loader写法:'',[],{}

```html

module:{
    rules:[
        {
            test:/\.css$/,
            use:'style-loader!css-loader'
        },
        or
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        or
        {  
            test:/\.css$/, 
            enforce:'pre' , // 强制前置执行
            use:{  // 这种对象的写法的好处就是可以携带参数
                loader:'css-loader',
                options:{
                    
                }
            }
        },
        {
            test:/\.css$/,
            use:'style-loader'
        }
    ]
}
```

- loader的分类

preLoader(前置) normalLoader(正常) inline(在代码中使用loader  ) postLoader(后置)

#### loader 解析css
- yarn add css-loader style-loader -D

```
 module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
        ]
    },
```

#### loader 解析less
- yarn add less less-loader -D

```
module :{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            },
        ]
    },
```

#### loader 解析js

- yarn add babel-loader @babel/core @babel/preset-env

```html
module:{
      rules :[  
          {
              test:/\.js$/,
              exclude:/node_modules/, // 排除  
              use:{
                  loader:'babel-loader',
                  options:{
                      "presets":["@babel/preset-env"],
                      "plugins": [
                          ["@babel/plugin-proposal-decorators", { "legacy": true }], // 转化装饰器
                          ["@babel/plugin-proposal-class-properties", { "loose": true }]  // 转化类属性
                          
                      ]
                  }
              }
          }
      ]
    },
```

- yarn add @babel/plugin-proposal-decorators     // 转化装饰器

- yarn add @babel/plugin-proposal-class-properties  // 转化类属性

- yarn add @babel/plugin-transform-runtime  // 转化js运行时的api 方法并且可以优化js抽离公共部分(promise,yeld...)

依赖

- yarn add @babel/runtime --save  (注意不能加dev,生产依赖,不用在plugins中配置)

- yarn add @babel/polyfill   

import '@babel/polyfill'  // 写了一整套的api 实例身上也可以调用 eg 'aaa'.include('a)

- yarn add "@babel/plugin-syntax-dynamic-import"  --save-dev   (webpack lazyloader)

#### loader 解析 img

- js中的引入

```
let img = new Image();
img.src = './logo.png'; // 不能放字符串，不会被打包  

import logo from './logo.png'; // 这样才会产生依赖关系，才会打包
let img = new Image();
img.src = logo;

// 会把logo进行生成一张新的图片放到dist目录下，会返回一个新的图片地址

```

- css背景图(css-loader 会把他变成require的形式 eg: background:url(require('./logo.png')))

```
module:{ // 对模块来进行配置
      rules :[ // 匹配的规则
          {
              test:/\.(png|jpg|gif)$/,
              use:{
                  loader:'url-loader', 
                  options:{
                      limit:200*1024,
                      name:'images/[hash:8].[name].[ext]'   //  图片放到./dist/images 常和output.publicPath配合使用确保图片地址引用正确
                      publicPath:"/url-loader-test/dist/"      //该地址不是唯一的，根据你的代码实际路由地址进行修改
                  }
              
       ]
}

// 两者的主要差异在于。url-loader可以设置图片大小限制，当图片超过限制时，其表现行为等同于file-loader，而当图片不超过限制时，则会将图片以base64的形式打包进css文件，以减少请求次数。
```

- <img src="" >   (打包后文件夹结构可能会变化，就会找不到)

html-withimg-loader (打包后也会变成base64)

```html
module:{
    rules :[ 
                {
                    test:/\.html$/,
                    use:'html-withimg-loader'
                }
           ]
     } 
```

### devServer  ---> express

- 默认打包是在内存中打包的
contentBase:'dist' （不配置也能成功是应为运行了html-webpack-plugin）

- 默认启动的服务是在根目录下

- creatGzip
compress:true

- 热更新

```

module.exports ={
   ...
   devServer:{
           hot:true  // 表示启动热更新
       },

   plugins:[
           // 使用热替换插件
           new webpack.HotModuleReplacementPlugin(),
   ...
}

```

#### proxy (依靠http-proxy-middleware(webpack内置))

- 后台配置跨域头

- 设置webpack-dev-server proxy

```
devServer:{
        // mock 自己的数据
        before(app){ // 默认webpack-dev-server 启动的时候 会调用这样的before 钩子， app参数是express()执行的结果
            app.get('/api/user',(req,res)=>{
                res.json({name:'world!'})
            })
        },

        proxy:{ // 只对开发的时候有效，上线代码一般会布置到一起,就不存在跨域了
            //'/api':'http://localhost:3000',
        
            // 前端发 /api/user   后台实际接口 /user
            '/api':{
                  target:'http://127.0.0.1:3000',
                  pathRewrite:{
                            '/api':''
                        }
                  }
             }

    },
```

- 把webpack在后台启动 （一般不会用） 

### resolve 第三方模块的解析规则

[深入浅出webpack学习(5)--Resolve](https://segmentfault.com/a/1190000013176083?utm_source=tag-newest)

```
resolve: { // 第三方模块的解析规则
        modules: [path.resolve("node_modules")],
        mainFiles: ['a.js','index.js'], // 入口文件的配置
        mainFields: ['style','main'], // 入口字段的配置 webpack会按照数组里的顺序去package.json文件里面找，只会使用找到的第一个。
        extensions:['.js', '.json'], //也就是说当遇到require('./data')这样的导入语句时，webpack会先去寻找./data.js文件，如果找不到则去找./data.json文件，如果还是找不到则会报错。
        alias: {
            'bootstrap':'bootstrap/dist/css/bootstrap.css'
        }

    },
```

### plugin

#### html-webpack-plugin

[html-webpack-plugin API](https://www.npmjs.com/package/html-webpack-plugin)

> 简化HTML文件的创建，为您的webpack捆绑服务提供服务。这对于webpack包含文件名中包含哈希值的bundle 来说尤其有用，它会更改每个编译。您可以让插件为您生成HTML文件(打包html并且把打包后的文件引入)

```
let HtmlWebpackPlugin = require('html-webpack-plugin');

plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html',  // 模版名称,此处html统一存放在public下
            filename: 'main.html'   // 生成html的名称，默认为index.html
            chunks:[chunk]  // 配合多入口进行使用时new 多个插件并分别配置代码块
            minify: {
                        removeAttributeQuotes: true, 
                        collapseWhitespace: true,
                    }
        })
       
    ]
```

#### DefinePlugin
DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。

[DefinePlugin 用法](https://www.webpackjs.com/plugins/define-plugin/)

```
plugins:[
        new webpack.DefinePlugin({
            // 定义的变量 需要json.stringify 包裹
            DEV:JSON.stringify('production'),   // or '"development"'
            EXPRESSION:'1+1',
            FLAG:'true'
        })
    ]
```

#### NameModulesPlugin
当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。

#### mini-css-extract-plugin （抽离css样式 变成link href 的形式）

- yarn add mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D

[mini-css-extract-plugin API](https://www.npmjs.com/package/mini-css-extract-plugin)

经过style-loader处理后会把样式以style标签的形式嵌入html ,如果css样式多的时候不适用，这个模块**内置style-loader**。

> ps:用这个plugin当环境变为生产环境需要手动压缩

```
let MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    // 生产环境需要手动压缩
    mode:'production',
    // 手动压缩配置
    optimization:{  //这里可以放一下优化配置,只有模式是**生产环境才会调用**, 用了这个后会自己的配置覆盖掉原来的配置，导致只有css进行了压缩,js没有压缩，所以需要手动调用
        minimizer:[ // 压缩配置
            new uglifyJSPlugin({
                cache:true,
                parallel:true, // 并行打包
                sourceMap:true // 调试使用的
            })
            new OptimizeCss()
        ]
    
    },    
    module:{
        rules:[
            {
                test:/\.css$/,
                use:'css-loader'
            }，
            {
                test:/\.css$/,
                use:MiniCssExtractPlugin.loader,
                enforce:'post'   // 强制最后执行
            }
        ]
    },
    plugin:[
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename:"[id].css"
        })
    ]
    
}

```

#### optimize-css-assets-webpack-plugin (生产环境压缩 css)

- yarn add optimize-css-assets-webpack-plugin -D

> 用法在上面

#### uglifyjs-webpack-plugin (压缩js)

- yarn add UglifyJSPlugin -D

当调用optimization后，会覆盖掉原来的配置，导致只有css进行了压缩,js没有压缩，所以需要手动调用

> 用法在上面

#### postcss-loader autoprefixer (css3加前缀,在css-loader之前使用)

[postcss-loader API](https://www.npmjs.com/package/postcss-loader)

```
webpack.config.js

module.exports = {

    module:{
        rules:[
            {
                test:/\.css$/,
                use:'css-loader'
            }，
            { // 1
                test:/\.css$/,
                use:'postcss-loader',
                options: {
                        ident: 'postcss',
                        plugins: [
                          require('autoprefixer')({...options}),
                          ...,
                        ]
                      }
            },
            {
                test:/\.css$/,
                use:MiniCssExtractPlugin.loader,
                enforce:'post'   // 强制最后执行
            }
        ]
    }, 
}

// 2
postcss.config.js

module.exports = {
    pulgins:[
        require('autoprefixer')
    ]
}


```

#### ESLint
- yarn add eslint eslint-loader -D

```
module :{
        rules:[
            {
                test:/\.js$/,
                enforce: "pre", // 必须在前面执行，先校验代码
                use:'eslint-loader'
            }
        ]
    }
```

#### clean-webpack-plugin (清空目录，一般在开发环境使用，常配合出口hash) 

- yarn add clean-webpack-plugin -D

```
let CleanWebpackPlugin = require('clean-webpack-plugin');

plugins:[ 
        new CleanWebpackPlugin() // 不需要传参，默认就会去找output.path
    ]
```

#### copy-webpack-plugin (拷贝静态资源插件)

- yarn add copy-webpack-plugin -D

```
let CopyWebpackPlugin = require('copy-webpack-plugin');

plugins:[ 
       new CopyWebpackPlugin([{
            from:'./assets',
            to:'./'   // 默认会拷贝到dist
        }])
]
```

#### webpack.DefinePlugin ( 设置环境变量 )

```
let webpack = require('webpack');

plugins:[
    new webpack.DefinePlugin({
                // 定义的变量 需要json.stringify 包裹
                DEV:JSON.stringify('production'),   // or '"development"'
                EXPRESSION:'1+1',
                FLAG:'true'
            })
]

```

#### webpack-merge (区分环境变量，进行不同配置)

- yarn add webpack-merge -D
```
let base = require('./webpack.base'); // 导入公共配置，loader entry  output 等
let merge = require('webpack-merge'); // 区分环境变量

let prod = {
    mode:'production'
};

module.exports = merge(base,prod);
```

### devtool 

#### socurc-map 
```

module.exports = {
      mode:'production'
      ...
      devtool:  source-map', // 会单独生成一个sourcemap文件 ，出错会标识当前报错的列和行  大而全
                // eval-source-map // 不会产生单独的文件，但是可以显示行和列
                // cheap-module-source-map // 不会产生列。但是是一个单独的映射文件
                // cheap-module-eval-source-map  // 不会产生文件，集成在打包后的文件中，不会产生列
}    
```

>  带cheap-module没有列，带eval在文件中
>  如果使用 mini-css-extract-plugin 优化配置优化js时也需要配置那里的sourceMap。当然默认情况就会产生source-map

### watch ( 监听打包 )

```
module.exports = {
     mode:'production'
     ...
     watch: true,
        watchOptions: { // 监控的选项
            poll:1000, // 以秒为单位 轮询
            aggregateTimeout:2000, // 防抖 只要不停地触发事件只执行最后一次   节流 每隔多少秒触发一次
            ignored: /node_modules/
        },

}
```


## others config

- webpack的配置文件是否只能为webpack.config.js?
    - 你可以在scripts的命令中配置 --config 名字 来实现重命名
    - 或者在script配置后 npm run build -- --config webpack.config1.js
    - webpack-cli/bin/config-yargs.js 中 defaultDescription: "webpack.config.js or webpackfile.js",

- htmlwebpackplugin 可不可以把这个插件运行放入到一个函数执行，根据入口的数量和相关配置来决定函数执行的次数？

- postcss如何写到行内（postcss 官网）

- jq在webpack中的使用(把$挂在window的方式?)

import $ from 'jquery'; --->每个文件打包后就会成为(function(arg){eval(...)})(); 这种window.$为undefined

```

// 1.通过expose-loader 暴露的loader

import  'expose-loader?$！jquery'  (! 属于loader的另一种类型 inline)

or

import  'jquery'

 rules :[ 
          {
              test:require.resolve(jquery), // 只要引用jquery 就能匹配到
              use:'expose-loader?$'

          },
        ]  

```    
 
```
// 2. 用webpack插件每个模块都提供一个$

plugins:[
    new webpack.Providelugin({ 
        '$':'jquery'   // 这个$并不是全局的
    })
]
```    

```
// 3. 在html引用
module.exports = {
    ...
    externals{  // 打包的时候需要排除掉
        'jquery':'$'
    }
}

```    

- npx 运行机制 (可以实现零配置打包)

```
@IF EXIST "%~dp0\node.exe" ( // 如果当前bin文件夹下存在node.exe 执行
  "%~dp0\node.exe"  "%~dp0\..\webpack\bin\webpack.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack\bin\webpack.js" %*  // 不存在执行 node ../webpack/bin/webpack.js
)
```
    
- 多入口配置
```
let HtmlWebpackPlugin = require('html-webpack-plugin');

 entry:{ // 入口文件数量
        index:'./src/index.js',
        main:'./src/main.js'
    },
 output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[hash:8].js'  // 根据入口名定义打包后的文件名
    },
 plugins:[
         new HtmlWebpackPlugin({
             template:'public/index.html',
             filename: 'index.html',
             minify: {
                 removeAttributeQuotes: true,
                 collapseWhitespace: true,
             },
             chunks: ["index"]   // 代码块名称
         }),
         new HtmlWebpackPlugin({
             template: "public/index.html",
             filename: "main.html",
             chunks: ["main"]   // 代码块名称
         })
     ]   

```

- 调试es6代码 需要一个sourceMap 源码映射

- 多页面应用抽离公共代码以及第三方模块
```
optimization: {
        splitChunks: { // 分离代码块
            cacheGroups: { // 缓存组
                common:{ // common~index~login
                    name:'xxx',
                    chunks: "initial",  // 从入口处抽离
                    minSize:0 ,   // 只要共用的部分超过0个字节 我就抽离
                    minChunks: 2, // 至少两次才抽离出来
                },
                vendor:{
                    priority:1,   // 权重，先走这里，默认为0
                    test:/node_modules/,  // 标识第三方模块，node_modules下的
                    chunks: "initial",
                    minSize:0,
                    minChunks:2
                }
            }
        }
    },

```




## 配置中出现的问题

1. [Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'.](https://stackoverflow.com/questions/42449999/webpack-import-module-exports-in-the-same-module-caused-error)


```
原因：
This happens if other modules down stream have an unexpected require tree. Babel changes require to import where it isn't supposed to which causes the aforementioned issue @Matthew Herbst. To solve this add "sourceType": "unambiguous" to your babelrc file or babel.config.js so that @babel/plugin-transform-runtime won't do this change of require expression to import in your commonjs files.

> babel.config.js

module.exports = {
  presets: [
    '@quasar/babel-preset-app'
  ],

  "sourceType": "unambiguous"
}
```

2. TypeError: this.getOptions is not a function
一般都是插件为了适配webpack5 做了升级，降低插件版本即可

3. [图片打包到公共img文件夹下，页面取不到图片问题（图片查找路径被添加了css/img/xxx）](https://segmentfault.com/q/1010000014640043)

```
loader: MiniCssExtractPlugin.loader,
options: {
  /*
  * 复写css文件中资源路径
  * webpack3.x配置在extract-text-webpack-plugin插件中
  * 因为css文件中的外链是相对与css的，
  * 我们抽离的css文件在可能会单独放在css文件夹内
  * 引用其他如img/a.png会寻址错误
  * 这种情况下所以单独需要配置../../，复写其中资源的路径
  */
  publicPath: '../../' 
}
```

4. 使用html-withimg-loader 引用图片地址变为  <img src={"default":"389a66a25c539a9fd3524d58c43e2560.png"}>

```
{
    test:/\.(png|jpg|gif)$/,
    loader:'url-loader',
    options:{
        esModule:false
    }
},
```

5. webpack4 使用最新 copy-webpack-plugin 打包报错 “compilation.getCache is not a function“
yarn add copy-webpack-plugin@6 -D  // 降低版本  npm

6. 通过默认的devServer配置启动的服务，打包的动态链接库找不到，需要配置contentBase

    