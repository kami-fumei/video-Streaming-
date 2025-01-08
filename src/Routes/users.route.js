import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {registerUser} from "../Controller/user.controller.js"
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

export {Userrouter}