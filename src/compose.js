function sum(a, b) {
    return a + b
}

function add(str) {
    return 'zf' + str
}

function lCase(str) {
    return str.toUpperCase()
}

let compose = (...fns) => {
    //debugger;
    // let fnss = fns.reduce((a,b)=>{
    //     return b(a)
    // })
    // console.log(fnss);
    // return (...arg)=>{
    //     return fns(...arg)
    // }

    // return (...arg)=>{
    //     return fns.reduce((a,b)=>{
    //         return b(a(...arg))
    //     })
    // }

    /*
    *       fn => (...arg)=>{                            // 返回值就是一个函数，就是一个地址
                    return fns.reduce((a,b)=>{           // 当下一个函数执行时 reduce才会执行，这时候
                        return b(a(...arg))
                    })
                }
    *
    *
    *
    * */


    return fns.reduce((a, b) => {
        return (...arg) => {
            return b(a(...arg))
        }
    })


    /**
     *     fn => fns.reduce((a, b) => {                  //  返回值是一个经过reduce后的函数 ===> add(sum(...arg)) ===>在这里reduce已经执行了
                    return (...arg) => {
                        return b(a(...arg))
                    }
                })
     *
     *
     *
     *
     * */

};

let composeR = (...fns) =>{

    return (...arg)=>{
        let fn = fns.pop();
        let r = fn(...arg);
        return fns.reduceRight((a,b)=>{
           return b(a)
        },r)
    }
}

let fn = compose(sum, add, lCase);
console.log(fn.toString());
let res = fn('g', 'zy');
console.log(res);

let fnR = composeR(lCase,add,sum);
console.log(fn.toString());
let resR = fnR('g', 'zy');
console.log(resR);