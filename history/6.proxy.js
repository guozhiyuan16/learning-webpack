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
        // mock 自己的数据
        before(app){ // 默认webpack-dev-server 启动的时候 会调用这样的before 钩子， app参数是express()执行的结果
            app.get('/api/user',(req,res)=>{
                res.json({name:'world!'})
            })
        },

        // proxy:{ // 只对开发的时候有效，上线代码一般会布置到一起,就不存在跨域了
        //     //'/api':'http://localhost:3000',
        //
        //     // 前端发 /api/user   后台实际接口 /user
        //     '/api':{
        //         target:'http://127.0.0.1:3000',
        //         pathRewrite:{
        //             '/api':''
        //         }
        //     }
        // }

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
            // minify: {
            //     removeAttributeQuotes: true,
            //     collapseWhitespace: true,
            // }
        })
    ]
}