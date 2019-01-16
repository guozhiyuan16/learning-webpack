let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:8].js'
    },
    devServer:{
        port:3000
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
        })
    ]
}