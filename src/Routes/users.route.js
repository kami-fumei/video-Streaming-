import { Router } from "express";
import {logOut,login,registerUser} from "../Controller/user/user.funcs.exports.js"
import {AuthVerify,upload} from "../middleware/middleware.funcs.exports.js"

const Userrouter = Router();


Userrouter.route("/register").post(upload.fields([{
    name:"avatar",
    maxCount:1
},
{
    name:"coverImg",
    maxCount:1
}
]),registerUser)

Userrouter.post("/login",login)

Userrouter.post("/logout",AuthVerify,logOut);

console.log("car",typeof Userrouter.post); 

export default Userrouter