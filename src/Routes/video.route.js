import { Router } from 'express';
import { AuthVerify, upload } from '../middleware/middleware.funcs.exports.js';
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from './../Controller/video/video.controller.js';


const router = Router();

router.get('/search',getAllVideos);

router.route("/publishvideo").post(AuthVerify,upload.fields([
    {
      name: 'videoFile',
      maxCount: 1,
    },
    {
      name: 'tmFile',
      maxCount: 1,
    },
  ])
    ,publishAVideo)

router.route("/watch/:videoId").get(getVideoById);

router.route("updatevideo/:videoId").patch(AuthVerify,updateVideo);

router.route("deleteVideo/:videoId").delete(AuthVerify,deleteVideo);
    export default  router;