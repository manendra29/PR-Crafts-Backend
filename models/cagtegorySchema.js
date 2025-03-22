import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const Category= new mongoose.model("Category",categorySchema);