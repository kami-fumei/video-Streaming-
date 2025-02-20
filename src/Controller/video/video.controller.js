import {
    asyncHandler,
    ApiErr,
    cloudUpload,
    ApiRes,
  } from '../../utils/untils.expoter.js';
  import { USER } from '../../models/user.models.js';
  import {Video} from '../../models/video.models.js'
  import fs from 'fs';
  
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //todo: get all videos based on query, sort, pagination


})

const publishAVideo = asyncHandler(async (req, res) => {
        // get video, upload to cloudinary, create video
    const { title, description,isPrivate} = req.body;
    const {videoFile,tmFile} = req.files;

    if(!videoFile||!tmFile||!title||!description){
        throw new ApiErr(400,"Require video , thembmail,title and description ")
    }

    const video =  await cloudUpload(videoFile[0]?.path);
    const thubmail = await cloudUpload(tmFile[0]?.path);
     
    if(!video||!thubmail){
        throw new  ApiErr(505,"some thing went worng while uploading")
    }

    const user = req.user;

   const newVideo =  await Video.create({
    videofile:video.url,
    titel,
    description,
    thubmail,
    duration,
    isPrivate,
    owner:user._id
   })

    if(!newVideo){
        throw new ApiErr(500,"video creation failed")
    }

    res.status(200).json(
        new ApiRes(200,"video successfuly uploaded ",newVideo)
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // get video by id

   const video = await Video.findById(videoId);

if(!video){
    throw new ApiErr(404,"video not found!")
}
 res.status(200).json(new ApiRes(200,"video found",video))    

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //todo: update video details like title, description, thumbnail
     const {title,description,isThumbmail}= req.body;
     const  thumbmail = req?.file;

     if(!title&&!description&&typeof isThumbmail !== "boolean" ){
        throw new ApiErr(400, "Please provide at least one field to update (title, description, or isThumbmail).");
     }

if(isThumbmail){
     if(!thumbmail){
        throw new ApiErr(404,"thumbmail not found please upload");
     }}

     const tmUrl = await cloudUpload(thumbmail.path)

     if(!tmUrl){
        throw new ApiErr(500,"thumbmail  upload failed");
     }

   const updatedVideo = await Video.findByIdAndUpdate(videoId,{
        $set:{
            ...(title && { title }),
            ...(description && { description }),
            ...(tmUrl && { thumbmail: tmUrl.url })
        }},{new:true})
     
        res.status(200).json(new ApiRes(200,"Updated Video Successfully",updatedVideo))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // delete video

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
    throw new ApiErr(404,"Video not found");
    } 

    res.status(200).json(new ApiRes(200,"Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const {isPrivate} =req.body;
    if (typeof isPrivate !== "boolean") {
        throw new ApiErr(400, "Please provide the publish status (isPrivate).");
    }
    const video = await findByIdAndUpdate(videoId,{isPrivate});

    if(!video){
        throw new ApiErr(500,"Something went wrong while updating")
    }

    res.status(200).json(new ApiErr(200,"Video publishes switched to:",isPrivate));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}