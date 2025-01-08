import { asyncHandler } from '../utils/asyncFunc.js';
import { ApiErr } from './../utils/ApiErr.js';
import { USER } from '../models/user.models.js';
import { cloudUpload } from '../utils/uploadToCloud.js';
import { ApiRes } from '../utils/ApiRes.js';

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (!userName || !password || !email || !fullName) {
    throw new ApiErr(400, 'All fields are required');
  }

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiErr(400, 'All fields are required');
  }

  console.log(password);

  const userExist = await USER.findOne({
    $or: [{ userName }, { email }],
  });
  if (userExist) throw new ApiErr(400, 'user already existes');

  let { avatar, coverImg } = req.files;

  if (!avatar) throw new ApiErr(409, 'Avatar require');

  const avatarPath = avatar[0]?.path;
  let coverImgPath;

  if (coverImg) coverImgPath = coverImg[0]?.path;

  console.log('done');

  const responesAavatar = await cloudUpload(avatarPath);
  let responesCoverImg = await cloudUpload(coverImgPath);

  if (!responesCoverImg) {
    responesCoverImg = '';
  }

  console.log(responesAavatar);
  if (!responesAavatar) return new ApiErr(500, 'new avatar upload failed');

  const newUser = await USER.create({
    userName,
    fullName,
    email,
    password,
    avatar: responesAavatar.url,
    coverImg: responesCoverImg.url,
  });

  if (!newUser) return new ApiErr(500, 'new User not created');
  //res =respones

  const resUser = await USER.findById(newUser._id).select(
    '-password -refreshToken'
  );

  if (!resUser) return new ApiErr(500, 'new User not created');

  return res
    .status(201)
    .json(new ApiRes(201, 'Successfully created user', resUser));
});

export { registerUser };
