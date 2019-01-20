let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    devServer:{
        contentBase:'./dist'
    },
    resolve: { // 第三方模块的解析规则
        modules: [path.resolve("node_modules")],
        mainFiles: ['a.js','index.js'], // 入口文件的配置
        mainFields: ['style','main'], // 入口字段的配置 webpack会按照数组里的顺序去package.json文件里面找，只会使用找到的第一个。
        extensions:['.js', '.json', '.css'], //也就是说当遇到require('./data')这样的导入语句时，webpack会先去寻找./data.js文件，如果找不到则去找./data.json文件，如果还是找不到则会报错。
        alias: { // 别名
            'bootstrap':'bootstrap/dist/css/bootstrap.css'
        }
    },
    module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env"],
                        "plugins":["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            }
        }),
        new webpack.DefinePlugin({
            // 定义的变量 需要json.stringify 包裹
            DEV:JSON.stringify('production'),   // or '"development"'
            EXPRESSION:'1+1',
            FLAG:'true'
        })
    ]
}