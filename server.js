let express = require('express');

let app = express();

app.get('/user',(req,res)=>{
    res.json({name:'guozhiyuan'})
})

app.listen(3000,()=>{
    console.log(`ok`)
});