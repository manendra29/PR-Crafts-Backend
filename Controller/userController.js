import { User } from "../models/userSchema.js";
import {catchAsyncError} from "../Middleware/catchAsyncError.js"
import ErrorHandler  from "../Middleware/error.js"
import { sendEmail } from "../utils/sendEmail.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";
import { Post } from "../models/postSchema.js";
import { Review } from "../models/reviewSchema.js";
import { Cart } from "../models/cartSchema.js";
import { Category } from "../models/cagtegorySchema.js";



const otpStorage=new Map();
export const generateOTP=catchAsyncError(async(req,res,next) =>{
    const {email}=req.body;
    const user=await User.find({email});
    if(user.length===1)
        return next(new ErrorHandler("User Already exists",400));
    let otp=Math.floor((Math.random()+1)*100000).toString();
    await sendEmail(email,otp);
    otpStorage.set(email,{otp,expires:Date.now()+300000});
    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp
    });
})

export const verifyOTP=catchAsyncError(async(req,res,next)=>{
    const {otp}=req.body;
    const storedOtpData = otpStorage.get(email); 
    if (!storedOtpData) {
  return next(new ErrorHandler("OTP not found or expired!", 400));
 }

const { otp: storedOtp, expiresAt } = storedOtpData;

if (Date.now() > expiresAt) {
otpStorage.delete(email); 
return next(new ErrorHandler("OTP has expired!", 400));
}
if (storedOtp !== otp) {
return next(new ErrorHandler("Invalid OTP!", 400));
}
otpStorage.delete(email);

res.status(201).json({
    success:true,
    message:"Otp Verified"
}); 
});


export const register=catchAsyncError(async(req,res,next) =>{
    const {username,email,password}=req.body;
    if(!username || !email || !password )
        return next(new ErrorHandler("Please provide all details!",400));
    
    const checkUser=await User.find({email});
    if(checkUser.length ===1)
        return next(new ErrorHandler("User Already exists",400));
   
  const user = await User.create({
    username,
    email,
    password,
  });
    generateJwtToken(user,"Registered successfully",201,res);
});

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password )
        return next(new ErrorHandler("Please provide both email and password ",400));
    const user=await User.findOne({email});
    if(!user)
        return next(new ErrorHandler("Invalid Credentials",400));
    const correctPassword=await user.comparePassword(password);
    if(!correctPassword)
        return next(new ErrorHandler("Incorrect Password",400));
    generateJwtToken(user,"Login successfully",201,res);
})

export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"User LogOut Successfully"
    });
});

export const getProfile=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(201).json({
        success:true,
        message:"Your Profile",
        user 
    })
});


export const changeDp=catchAsyncError(async(req,res,next) =>{
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Profile Picture is Needed",400));
     const {profilePicture}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(profilePicture.mimetype))
         return next(new ErrorHandler("Profile Picture format not supported",400));

     const cloudinaryResponse= await cloudinary.uploader.upload(
        profilePicture.tempFilePath,
        {
            folder:"Profile_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const filter={_id:req.user._id};
    const data = {
        $set: {
          profilePicture:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
        }
      };
    const profileImage=await User.updateOne(filter,data);
    res.status(201).json({
        success:true,
        message:"Profile Updated Successfully",
        profileImage
    })
})

export const addReview=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    const {description,star,title}=req.body;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    if(!post)
        return next(new ErrorHandler("Post not found!",404));
    const user=req.user;
    if(!user)
        return next(new ErrorHandler("Please Loggin",404));
    if(!description || !star || !title)
        return next(new ErrorHandler("Please provide all details",400));
    const imagePaths = req.files.map(file => file.path);
    const review = await Review.create({
       description,star,userId:user._id,postId:post._id,images:imagePaths,title
      });
      res.status(201).json({
        success:true,
        message:"Review Created",
        review
      })
})

export const deleteReview=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=req.user;
    const review=await Review.findById(id);
    if(!review)
        return next(new ErrorHandler("Review Doesn't Found",404));

    if (review.userId.toString() !== user._id.toString())
        return next(new ErrorHandler("You are not authorized to delete", 401));
    

    const deletedReview=await Review.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Review Deleted",
        deleteReview
    })
})

export const getReviewsOfPost=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const reviews=await Review.find({postId:id});
    res.status(201).json({
        success:true,
        message:"All Reviews",
        reviews
    })

});

export const addToCart=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    const {quantity,customization,price,image,title}=req.body;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    if(!post)
        return next(new ErrorHandler("Post not found",404));
    if(!quantity || !price || !image || !title)
        return next(new ErrorHandler("Please provide all details",400));
    const addToCart=await Cart.create({
        userId:req.user._id,
        postId:post._id,
        title,price,image,customization,quantity
    })
    res.status(201).json({
        success:true,
        message:"Item added to cart",
        addToCart
    })
})

export const deleteCartProduct=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const cart=await Cart.findById(id);
    if(!cart)
        return next(new ErrorHandler("Cart not found",404));
    if(cart.userId.toString() !== req.user._id.toString())
        return next(new ErrorHandler("You are not authorized to delete",401));
    const deletedCart=await Cart.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Cart Deleted",
        deletedCart
    })
}
);

export const underPrice=catchAsyncError(async(req,res,next) =>{
    const {price}=req.params;

    const posts=await Post.find({price:{$lt:(price-'-1')}});
    res.status(201).json({
        success:true,
        message:`All products under ${price}`,
        posts
    })
})

export const productsTagLine=catchAsyncError(async(req,res,next) =>{
    const {tag}=req.params;
    const posts=await Post.find({tag});
    res.status(201).json({
        success:true,
        message:`All products under ${tag}`,
        posts
    });
})

export const cartSize=catchAsyncError(async(req,res,next) =>{
    const cart=await Cart.find({userId:req.user._id});
    const cartLength=cart.length;
    res.status(201).json({
        success:true,
        message:"My Cart size",
        cartLength
    })
})

export const MyCart=catchAsyncError(async(req,res,next) =>{
    const cart=await Cart.find({userId:req.user._id});
    res.status(201).json({
        success:true,
        message:"My cart",
        cart
    })
})




