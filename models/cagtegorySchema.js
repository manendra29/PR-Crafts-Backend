import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    title:String,
    description:String,
  image:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const Category= new mongoose.model("Category",categorySchema);