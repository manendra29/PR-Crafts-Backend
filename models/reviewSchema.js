import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:String,
    star:Number,
    images:[{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    }],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});


export const Review=new mongoose.model("Review",reviewSchema)