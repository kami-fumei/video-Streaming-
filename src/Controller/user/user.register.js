import {
  asyncHandler,
  ApiErr,
  cloudUpload,
  ApiRes,
} from '../../utils/untils.expoter.js';
import { USER } from '../../models/user.models.js';
import fs from 'fs';
import { log } from 'console';

const filesPath = (req) => {
  let { avatar, coverImg } = req.files;
  let avatarPath = null,
    coverImgPath = null;

  if (avatar) {
    avatarPath = avatar[0]?.path;
  }

  if (coverImg) {
       coverImgPath = coverImg[0]?.path;
  }

  return { avatarPath, coverImgPath };
}

const removeFlie = (avatarPath,coverImgPath) => {
  if (avatarPath) {
    fs.unlinkSync(avatarPath);
  }
  if(coverImgPath) {
   fs.unlinkSync(coverImgPath);
  }
}

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { userName, fullName, email, password } = req.body;

    const { avatarPath, coverImgPath } = filesPath(req);

    if (!avatarPath) throw new ApiErr(400, 'Avatar is a required field');

    if (!userName || !password || !email || !fullName) {
      throw new ApiErr(400, 'All fields are required');
    }

    if (
      [fullName, email, userName, password].some(
        (field) => field?.trim() === ''
      )
    ) {
      throw new ApiErr(400, 'All fields are required');
    }

    const userExist = await USER.findOne({
      $or: [{ userName }, { email }],
    });

    if (userExist) {
      throw new ApiErr(400, 'user already existes');
    }

    const urlAavatar = (await cloudUpload(avatarPath)).url;

    let urlCoverImg;
    if (coverImgPath) urlCoverImg =  (await cloudUpload(coverImgPath)).url;

    if (!urlAavatar||(coverImgPath&&!urlCoverImg)) return new ApiErr(500, 'avatar or coverImgP upload failed');
  
    const newUser = await USER.create({
      userName,
      fullName,
      email,
      password,
      avatar: urlAavatar,
      coverImg: urlCoverImg || '',
    });

    if (!newUser) return new ApiErr(500, 'new User not created');
   
    const resUser = await USER.findById(newUser._id).select(
      '-password -refreshToken'
    );

    if (!resUser) return new ApiErr(500, 'new User not created');

    removeFlie( avatarPath, coverImgPath);
    return res
      .status(201)
      .json(new ApiRes(201, 'Successfully created user', resUser));
  }
   catch (error) {
    const { avatarPath, coverImgPath } = filesPath(req);
    console.log( error);
    removeFlie( avatarPath, coverImgPath);
   throw error;
  }
});
export { registerUser };
