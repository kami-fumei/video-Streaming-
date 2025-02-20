import mongoose from 'mongoose';
import { USER } from '../../models/user.models.js';
import { asyncHandler, ApiErr, ApiRes } from '../../utils/untils.expoter.js';

const getUserChannel = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName) {
    throw new ApiErr(400, 'username is missing');
  }
  const channel = await USER.aggregate([
    {
      $match: {
        userName,
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
      },
    },
    {
      $addFields: {
        isSubscribe: {
          $cond: {
            if: {
              $in: [req?.user?._id, '$subscribers.subscriber'],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        userName: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImg: 1,
        isSubscribe:1,
        subscribersCount: {
          $size: '$subscribers',
        },
        subscribedToCount: {
          $size: '$subscribedTo',
        },
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiErr(404, 'Channel not found');
  }
  res.status(200).json(new ApiRes(200, 'User Channel data', channel));
});
//todo testing 
const getWatchHistory = asyncHandler(async () => {
  const watHis = await USER.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);
  if (!watHis) {
    throw new ApiErr(404, 'no watch history');
  }

  res.status(200).json(new ApiRes(200, 'WatchHistory data', watHis));
});

export { getUserChannel, getWatchHistory };
