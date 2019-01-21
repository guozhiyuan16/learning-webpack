let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
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
    entry:{
        index:'./src/index.js',
        login:'./src/login.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    devServer:{
        port:8080
    },
    module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env","@babel/preset-react"],
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
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename: 'login.html',
            chunks: ['login']
        })
    ]
}