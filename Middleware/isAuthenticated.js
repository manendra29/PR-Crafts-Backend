import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";

export const isAuthenticated=catchAsyncError(async(req,res,next) =>{
    const token=req.cookies.token;
    if(!token)
        return next(new ErrorHandler("User is not Authenticated!",401));
    const decode=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decode.id);
    next();
});


export const isAuthorized=(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role))
            return next(new ErrorHandler(`${req.user.role} are not authorized to do this thing`,403));
        next();
    }
}