import {asyncHandler,ApiErr,ApiRes} from "../../../utils/untils.expoter.js"
import { USER } from '../../../models/user.models.js';

const changePassword = asyncHandler(async(req,res)=> {

    const {oldPassword,newPasswoed} =req.body;

    const user = await USER.findById(req.user._id);

   const isPassCorrect= await user.isPasswordCorrect(oldPassword);

   if(!isPassCorrect){
    throw new ApiErr(401,"invaild password");
   }
 
   user.password = newPasswoed;

const newUser =  await user.save({new:true});//.select("-password -refreshToken");

res.status(200).json( new ApiRes(200,"password changed successfully"));
});
//--
const updateUserDetails =asyncHandler(async(req,res)=>{
  const {newFullName,newUserName,newEmail} = req.body;

  if (!newFullName && !newUserName && !newEmail) {
    throw new ApiErr(400, "fullName, userName, and email any one is required fields.");
  }
  if(newUserName){
const isUserNameExit =await USER.findOne({"userName":newUserName});

if(isUserNameExit) throw new ApiErr(404,"User name already taken")
  }
  const user = await USER.findByIdAndUpdate(req.user._id,{
    $set:{
        fullName:newFullName,
        userName:newUserName,
        email:newEmail
    }
  },{
    new:true
  }).select("-password -refreshToken");

  if(!user){
    throw new ApiErr(400,"Failed to update user details or User not found.");
  }

  res.status(200).json(200,new ApiRes(200,"User details updated successfully",user))

});

export{
  changePassword,updateUserDetails
}