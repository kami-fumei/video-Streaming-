import mongoose from 'mongoose';
import mongooesAggreatePaginate from "mongoose-aggregate-paginate-v2"

const videoShema = new mongoose.Schema(
  {
    videofile: {
      type: String,
      require: [true, 'video is required'],
    },
    titel: {
      type: String,
      require: [true, 'titel is required'],
    },
    description: {
      type: String,
      require: [true, 'description is required'],
    },
    viwes: {
      type: Number,
      default:0
    },
    thubmail: {
      type: String,
      require: [true, 'thubmail is required'],
    },
    duration:{
        type:Number,
        require: [true, 'duration is required'],
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  },
  { timestamps: true }
);
mongoose.plugin(mongooesAggreatePaginate,)