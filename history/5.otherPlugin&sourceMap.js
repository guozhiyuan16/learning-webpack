let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let webpack = require('webpack');

module.exports = {
    mode:'production',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:8].js',
    },
    devServer:{
        port:4000
    },
    // devtool: "source-map", //  告诉webpack 生成一个map(name.js.map) ，会表示源码中哪行那列报错了
    // // eval-source-map // 当前打包的js中
    // // cheap-module-source-map // 简化版，不在文件中
    // // cheap-module-eval-source-map  是一个在文件中的source-map,打包出来会很大，没有列的定位功能
    // // ps: 带cheap-module没有列，带eval在文件中
    // // ps: 如果使用 mini-css-extract-plugin 优化配置优化js时也需要配置那里的sourceMap。当然默认情况就会产生source-map
    // watch: true,
    // watchOptions: { // 监控的选项
    //     poll:1000, // 以秒为单位 轮询
    //     aggregateTimeout:2000, // 防抖 只要不停地触发事件只执行最后一次   节流 每隔多少秒触发一次
    //     ignored: /node_modules/
    // },
    module :{
        rules:[
            {
                test:/\.html$/,
                use:'html-withimg-loader'
            },
            {
                test:/\.(png|jpeg|gif)$/,
                // use:'file-loader'
                use:{
                    loader: "url-loader",
                    options:{
                        limit:200*1024,
                        name:'images/[hash:8].[name].[ext]'
                    }
                }
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            },
            // {
            //     test:/\.js$/,
            //     enforce: "pre", // 在代码打包之前校验，前置
            //     use:'eslint-loader'
            // },
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
            chunks:['main']
        }),
        new CleanWebpackPlugin(['./dist']),
        new CopyWebpackPlugin([{
            from:'./assets',
            to:'./'
        }]),
        new webpack.BannerPlugin("make by 2019")
    ]
}