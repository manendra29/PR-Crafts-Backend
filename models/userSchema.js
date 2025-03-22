import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minLength:[3,"Username should have 3 characters atleast"],
        maxLength:[40,"Username cannot exceed 40 characters"],
    },
    password:{
        type:String,
        selected:false,
        minLength:[8,"password should be of 8 characters atleast"],
    },
    email: String,
    profilePicture:{
            type:String,
            require:true,
    },
    role:{
      type:String,
      default:"User",
      enum:["User","Admin"]
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
  }
  
  userSchema.methods.generateJsonWebToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
      expiresIn:process.env.JWT_EXPIRES_IN
    })
  }
  
  export const User=new mongoose.model("User",userSchema);