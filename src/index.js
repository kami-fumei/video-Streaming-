import express from "express"
import { connectDB } from "./db/db.connect.js";
import 'dotenv/config'
// require('dotenv').config({path:'./env'});

const app = express();

connectDB();
app.get("/",(req,res)=>{
    res.end("helo");
})

app.listen(process.env.PORT,()=>{
    console.log("port connected to ",process.env.PORT);
    //hi
})