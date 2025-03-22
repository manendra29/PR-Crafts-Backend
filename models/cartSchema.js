import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    quantity:Number,
    customization:String,
    image:String,
    title:String,
    price:Number,
    userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        postId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        },
})

export const Cart=new mongoose.model("Cart",cartSchema);