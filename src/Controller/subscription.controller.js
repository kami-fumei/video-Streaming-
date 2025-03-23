 import { SUBSCRIPTION } from '../models/subscription.model';
 import { asyncHandler, ApiErr, ApiRes } from '../utils/untils.expoter.js';
 
const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    const isSub = await SUBSCRIPTION.findOneAndDelete({
        $and: [{ channel:channelId }, { subscriber:req.user._id  }]
    })
    let newSub;
    if(!isSub){
       newSub=  await SUBSCRIPTION.creat({
            channel:channelId,
            subscriber:req.user._id
        })
    }

    res.status(200).json( new ApiRes(200,"new sub added Successfully",newSub));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
  const result =  await SUBSCRIPTION.aggregate([{
        $match :{channel :channelId}
    },{
        $lookup:{
            from:'users',
            localField:'subscriber',
            foreignField:'_id',
            as:'subscriberName'
        }
    }])
    res.status(200).json( new ApiRes(200,"Fetched subscriber successfully",result));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    // const { subscriberId } = req.params;
    const x = await SUBSCRIPTION.aggregate([
      { 
     $match :{
        subscriber:user._id
     }
         },{$lookup:{
            from :"user",
            foreignField:"_id",
            localField:"channel",
            as :"subscribedChannel"
         }

         },{
            $project:{
                channel:1
            }
         }
        ]
    );  
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}