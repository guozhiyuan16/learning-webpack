let path = require('path');
let webpack = require('webpack');
module.exports = {
    mode:'development',
    entry:{
        react:['react','react-dom']     // 只要是第三方的都可以
    },
    output: {
        library:'[name]_dll',  // var xxx = 结果    拿到module.exports 的返回值,原来在必报中拿不到
        filename: "_dll_[name].js",    // 输出的文件的名字随便起即可
        path: path.resolve(__dirname,'dist')
    },
    plugins: [
        new webpack.DllPlugin({
            name:'[name]_dll',  // 需要和libery相等
            path: path.resolve(__dirname,'dist','manifest.json')    // manifest.json 列出了react 中所有的东西
        })
    ]
};