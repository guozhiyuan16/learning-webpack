let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'production',
    entry:{
        index:'./src/index.js',
        main:'./src/main.js'
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
                use:['style-loader','css-loader']
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env"],
                        "plugins":[
                            ["@babel/plugin-proposal-decorators", { "legacy": true }], // 转化装饰器
                            ["@babel/plugin-proposal-class-properties", { "loose": true }]  // 转化类属性
                        ]
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'public/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: "main.html",
            chunks: ["main"]
        })
    ]
}