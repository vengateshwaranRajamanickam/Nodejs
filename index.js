const express=require("express")
const app=express()
const PORT=9000;
//req-what you send to server
//res-what you receive from server

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(PORT,()=>console.log("derver started on port",PORT))