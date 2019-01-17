let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    mode:'production',
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache :true,
                parallel:true, // 并行打包
                sourceMap:true // 调试使用的
            }),
            new OptimizeCss()
        ]
    },
    entry:{
        login:'./src/login.js',
        index:'./src/index.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[hash:8].js'
    },
    devServer:{
        port:3000
    },
    module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader','postcss-loader']
            },
            {
                test:/\.less$/,
                use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
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
            filename: 'login.html',
            chunks: ['login']
        }),
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename:"[id].css"
        }),
    ]
}