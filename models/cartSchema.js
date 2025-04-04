import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    quantity:Number,
    customization:{
        type:String,
        default:"Do as Your Own "

    },
    title:String,
    price:Number,
    Image:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
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