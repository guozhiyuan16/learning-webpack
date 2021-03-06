---

title:CommonJS&AMD&CMD&ES6 module

---
## 为什么有模块概念
理想情况下，开发者只需要实现核心的业务逻辑，其他都可以加载别人已经写好的模块。

但是，Javascript不是一种模块化编程语言，在es6以前，它是不支持”类”（class），所以也就没有”模块”（module）了。

## require 时代

- 原始写法

```angular2
function m1(){
　//...
}
function m2(){
　//...　　
}
```

模块就是实现特定功能的一组方法。

只要把不同的函数（以及记录状态的变量）简单地放在一起，就算是一个模块。

这种做法的缺点很明显：**”污染”了全局变量，无法保证不与其他模块发生变量名冲突，而且模块成员之间看不出直接关系**。

- 对象写法 (为了解决上面的缺点，可以把模块写成一个对象，所有的模块成员都放到这个对象里面)

```angular2
var module1 = new Object({
_count : 0,
　m1 : function (){
　　//...
　},
　m2 : function (){
　　//...
　}
});
```
上面的函数m1()和m2(），都封装在module1对象里。使用的时候，就是调用这个对象的属性 module1.m1();

这样的写法**会暴露所有模块成员，内部状态可以被外部改写**。比如，外部代码可以直接改变内部计数器的值。module._count = 1;

- IIFE (自执行函数)

```angular2
var module = (function() {
var _count = 0;
var m1 = function() {
alert(_count)
}
var m2 = function() {
alert(_count + 1)
}
 
return {
m1: m1,
m2: m2
}
})()
```
使用上面的写法，外部代码无法读取内部的_count变量。module就是Javascript模块的基本写法。

## 主流模块规范

在es6以前，还没有提出一套官方的规范,从社区和框架推广程度而言,目前通行的javascript模块规范有两种：CommonJS 和 AMD

### CommonJS规范

[js模块化编程之彻底弄懂CommonJS和AMD/CMD！](http://www.cnblogs.com/chenguangliang/p/5856701.htm)
[CommonJS、AMD、CMD、NodeJs、RequireJS到底有什么联系？](https://blog.csdn.net/fabulous1111/article/details/73431382)
[彻底搞清楚javascript中的require、import和export](https://www.cnblogs.com/libin-1/p/7127481.html)
```
// CommonJS模块
let { stat, exists, readFile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
- 实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

- CommonJS 模块输出的是值的缓存，不存在动态更新，

### ES6 module

[阮一峰的ECMAScript 6 入门 - Module 的语法](http://es6.ruanyifeng.com/#docs/module)

```
// ES6模块
import { stat, exists, readFile } from 'fs';
```
- 上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

```
// 报错
export 1;

// 报错
var m = 1;
export m;

// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};

它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系。

```
- export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

```
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

上面代码输出变量foo，值为bar，500 毫秒之后变成baz。
```
- export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

- export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的import命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```
// main.js
import {firstName, lastName, year} from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

- import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同。

```angular2
import { lastName as surname } from './profile.js';
```
- 如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。

```angular2
import {a} from './xxx.js'

a = {}; // Syntax Error : 'a' is read-only;
```
- import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

```angular2
import {a} from './xxx.js'

a.foo = 'hello'; // 合法操作 

**a的属性可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，轻易不要改变它的属性。**

```
- 脚本加载了变量a，对其重新赋值就会报错，因为a是一个只读的接口。但是，如果a是一个对象，改写a的属性是允许的。

- import命令具有提升效果，会提升到整个模块的头部，首先执行。(这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。)

```angular2
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
上面三种写法都会报错，因为它们用到了表达式、变量和if结构。在静态分析阶段，这些语法都是没法得到值的。
```

- import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
- import语句会执行所加载的模块

- CommonJS 模块的require命令和 ES6 模块的import命令，可以写在同一个模块里面，但是最好不要这样做。因为import在静态解析阶段执行，所以它是一个模块之中最早执行的。

- export default命令，为模块指定默认输出。

- 一个模块只能有一个默认输出，因此export default命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应export default命令

```
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```
- export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字
```
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```
- 正是因为export default命令**其实只是输出一个叫做default的变量**，所以它后面不能跟变量声明语句。

```
// 正确
export default 42;

// 报错
export 42;
```
- 因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。

```angular2
// import()函数，完成动态加载。

const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
  
import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
```

- import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中）。
  
  这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。===>import()函数，完成动态加载。