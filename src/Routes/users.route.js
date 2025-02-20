import { Router } from 'express';
import {
  logOut,
  login,
  registerUser,
  refreshToken,
  changePassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImg,
  getUserChannel, getWatchHistory
} from '../Controller/user/user.funcs.exports.js';
import { AuthVerify, upload } from '../middleware/middleware.funcs.exports.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImg',
      maxCount: 1,
    },
  ]),
  registerUser
);
router.post('/login', login);

router.post('/logout', AuthVerify, logOut);

router.post('/refreshtoken', refreshToken);

router.route('/change-password').post(AuthVerify, changePassword);

router.route('/update-details').patch(AuthVerify,updateUserDetails)

router.route('/update-Avatar').patch(AuthVerify,upload.single('avatar'),updateUserAvatar);

router.route('/update-coverImg').patch(AuthVerify,upload.single('coverImg'), updateUserCoverImg );

router.route('/@:userName').get(getUserChannel)

export default router;
 