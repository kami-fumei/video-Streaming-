import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { Userrouter } from "./Routes/users.route.js"

const app = express();

app.use(cors({
    origin:process.env.CORS_PORT,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:false, limit:"16kb"}))
app.use(cookieParser())
app.use(express.static("public"))

app.use("/api/v1/user",Userrouter);



export {app}