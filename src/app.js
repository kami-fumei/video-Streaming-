import express from "express"
import {connectDB} from "./db/db.connect.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import 'dotenv/config'
// require('dotenv').config({path:'./env'});

const app = express();

app.use(cors({
    origin:process.env.CORS_PORT,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:false, limit:"16kb"}))
app.use(cookieParser())
app.use(express.static("../public"))

connectDB().then(()=>{
        let PORT= process.env.PORT||8000;
        app.listen(PORT,()=>{
            console.log(`Server listening at ${PORT}`);
        })
    }
).catch((err)=>{
 console.log(`DB not connected (index.js) errr: ${err}`);
 
});





// export {app}