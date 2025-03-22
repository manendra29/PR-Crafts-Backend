import mongoose from "mongoose";

const sliderSchema=new mongoose.Schema({
    images:[{
        type:String,
        required:true
    }
    ],
    title:String,
})

export const Slider=new mongoose.model("Slider",sliderSchema);