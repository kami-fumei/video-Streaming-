import jwt from "jsonwebtoken"
import {asyncHandler,ApiErr,ApiRes} from "../../utils/untils.expoter.js"
import { USER } from '../../models/user.models.js';
import { log } from "console";

const refreshToken = asyncHandler(async (req,res)=>{
try{
    const userRefreshToken =req?.cookies?.REFRESH_TOKEN ||req.header("Authorization")?.replace("Bearer ", "");
   
    if(!userRefreshToken){
  throw new ApiErr(401,"Required token");
  }
 const decodedInfo =  jwt.verify(userRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 if(!decodedInfo){
  throw new ApiErr(401,"Invaild token");
 }
  const user =await USER.findById(decodedInfo._id);

  if(user.refreshToken!==userRefreshToken){
    throw new ApiErr(401,"Expired token");
  }
 const newRefreshToken = await user.genrateREFRESH_TOKEN();
 
 user.refreshToken = newRefreshToken;
 
 user.save({ validateBeforeSave: false });


 

 res.status(200).cookie("REFRESH_TOKEN",newRefreshToken,{
  httpOnly:true,
  secure:true,
}).json(new ApiRes(200,"REFRESHED TOKEN SENT"))
  
}catch(err){
  
 throw new ApiErr(401,err.message||"Invaid token")
}
});

export{refreshToken}