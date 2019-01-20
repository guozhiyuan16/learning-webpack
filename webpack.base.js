let path = require('path');
let webpack = require('webpack');
let HappyPack = require('happypack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //mode:'development',
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:8].js'
    },
    module :{
        noParse:/jquery/, // 如果确定没有依赖可以加载这里，不会去解析
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
            use:[{
                loader:'babel-loader',
                options:{
                    "presets":["@babel/preset-env"],
                    "plugins":["@babel/plugin-proposal-class-properties"]
                }
            }]
        }),
        new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果发现moment 中引入了local 就忽略掉(会把虽有的都忽略，所以js需要手动加载一下对应的语言包)
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