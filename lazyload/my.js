var btn = document.createElement('button');
btn.innerHTML = '点击';
document.body.appendChild(btn);
btn.addEventListener('click', function () {

    // 默认加载0.js
    __webpack_require__.e(0)
        .then(__webpack_require__.bind(null, "./src/test.js"))
        .then(function (data) {
            console.log(data.default);
        })
});

//  webpack 懒加载的原理
// 1) 默认重写了push 方法  webpackJSONPCallBack
// 2) 加载入口文件 当点击时 会调用__webpack_require__.e
// 3) __webpack_require__.e这个方法会创建一个promise 并且返回一个promise
// 4) 会创建jsonp 加载0.js  把后夹杂爱的结构合并到modules
// 5) 合并后调用 当前 __webpack_require__.e方法的promise成功
// 6) 可以引用到后加载的模块，取到最终的结果