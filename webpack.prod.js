let base = require('./webpack.base');
let merge = require('webpack-merge'); // 区分环境变量

let prod = {
    mode:'production'
};


module.exports = merge(base,prod);