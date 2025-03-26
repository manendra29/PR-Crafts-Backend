import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    size:String,
    specification:String,
    quantity:Number,
    discount:Number,
    stock:{
        type:String,
        enum:["Active","Out Of Stocks"]
    },
   tag:{
    type:String,
    default:"New Arrival",
    enum:["New Arrival","BestSeller","Limited Edition"]
   },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    postImages:[{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    }],

    createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Post=new mongoose.model("Post",postSchema);

