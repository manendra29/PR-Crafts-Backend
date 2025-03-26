import mongoose from "mongoose";

const sliderSchema=new mongoose.Schema({
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
    title:String,
})

export const Slider=new mongoose.model("Slider",sliderSchema);