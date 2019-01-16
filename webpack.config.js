let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:8].js',
    },
    devServer:{
        port:3000
    },
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
        })
    ]
}