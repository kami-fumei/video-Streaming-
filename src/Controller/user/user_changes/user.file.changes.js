import {
  asyncHandler,
  ApiErr,
  ApiRes,
  cloudUpload,
} from '../../../utils/untils.expoter.js';
import { USER } from '../../../models/user.models.js';
import { extractPublicId } from 'cloudinary-build-url';
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET,
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const  avatarPath  = req.file?.path;

 try {
     if (!avatarPath) {
       throw new ApiErr(400, 'Avatar is missing');
     }
    //  const oldAvatarUrl = await USER.findById(req.user._id).select('avatar');
   
     const publicId =  extractPublicId(req.user.avatar); 
   
    //  if(!publicId) {
    //   throw new ApiErr(500)
    //  }
 
     const newAvatar = (await cloudUpload(avatarPath));
     
   if(!newAvatar.url){
       throw new ApiErr(500, 'Avatar upload failed');
   }
     const user = await USER.findByIdAndUpdate(
       req.user._id,
       {
         avatar: newAvatar.url,
       },
       {
         new: true,
       }
     ).select('-password -refreshToken');
   
     if (user) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
      } catch (error) { 
        ApiErr(500,"Error destroying resource"); 
      }
     } else {
       throw new ApiErr(500, 'Avatar updation failed');
     }

//  if (avatarPath) {
//     fs.unlinkSync(avatarPath);
//   }

return res.status(200).json(new ApiRes(200,"Successfully Updated Avatar",user))

} catch (error) {

  //    if (avatarPath) {
  //   fs.unlinkSync(avatarPath);
  // }
  throw new ApiErr(error.statusCode||500, error?.message || "something went wrong")
 }
});

//---          xxx           ---
const updateUserCoverImg = asyncHandler(async (req, res) => {
    const coverImgPath  = req.file?.path;
 try {
     if (!coverImgPath) {
       throw new ApiErr(400, 'coverImg is missing');
     }
   
    
     console.log(req.user.coverImg);   
     const publicId = extractPublicId(req.user.coverImg); 
   
     if(!publicId) {
      throw new ApiErr(500)
     }

     const newCoverImg = await cloudUpload(coverImgPath);
     
   if(!newCoverImg.url){
       throw new ApiErr(500, 'coverImg upload failed');
   }
     const user = await USER.findByIdAndUpdate(
       req.user._id, 
       {
         coverImg: newCoverImg.url,
       },
       {
         new: true,
       }
     ).select('-password -refreshToken');

     console.log("Attempting to delete resource with publicId:", publicId);
   
     if (user) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
      } catch (error) { 
        console.error("Error destroying resource:", error); 
      }
     } else {
       throw new ApiErr(500, 'coverImg updation failed');
     }

//  if (coverImgPath) { 
//     fs.unlinkSync(coverImgPath);
//   }

return res.status(200).json(new ApiRes(200,"Successfully Updated coverImg",user))

} catch (error) {
    
  //    if (coverImgPath) {
  //   fs.unlinkSync(coverImgPath);
  // }
  throw new ApiErr(error?.statusCode||500, error?.message || "something went wrong")
 }
});

export{
    updateUserAvatar,
    updateUserCoverImg
}