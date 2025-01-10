import {asyncHandler,ApiErr,ApiRes} from "../../utils/untils.expoter.js"
import {USER} from "../../models/user.models.js"

const logOut = asyncHandler(async (req,res)=>{
    await USER.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:null
        }
    },{
        new:true
    })
    const Option ={
        httpOnly:true,
        secure:true,
    }
    res.status(201).clearCookie("ACCESS_TOKEN",Option)
     .clearCookie("REFRESH_TOKEN",Option).json(
     new ApiRes(201,"loged out successfully")
    )
})

export{logOut}       