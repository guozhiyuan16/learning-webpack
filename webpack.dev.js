let base = require('./webpack.base');
let merge = require('webpack-merge');

let dev = {
    mode:'development',

    devServer:{
        port:3000
    },

};


module.exports = merge(base,dev);