let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'index.js'
    },
    devServer:{
        contentBase:'./dist',
        host:'127.0.0.1',
        hot:true  // 表示启动热更新
    },
    module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env","@babel/preset-react"],
                        "plugins":["@babel/plugin-syntax-dynamic-import"]
                    }
                }
            }
        ]
    },
    plugins:[
        // 使用热替换插件
        new webpack.HotModuleReplacementPlugin(),
        // 每次更新的时候 通知是哪个文件更新了
        new webpack.NamedChunksPlugin(),
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename: 'index.html'
        }),
        new webpack.DllReferencePlugin({  //  dll 引用插件
            manifest: path.resolve(__dirname,'dist','manifest.json')  // 内部引用了react,react-dom 会先在manifest.json中寻找，找不到才会打包，找到的话通过此文件找全局下的react_dll这个变量，通过manifest.json中的id 拿到对应的值
        })
    ]
}