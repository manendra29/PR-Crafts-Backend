import { User } from "../models/userSchema.js";
import {catchAsyncError} from "../Middleware/catchAsyncError.js"
import ErrorHandler  from "../Middleware/error.js"
import { sendEmail } from "../utils/sendEmail.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import mongoose from "mongoose";
import { Post } from "../models/postSchema.js";
import { Review } from "../models/reviewSchema.js";
import { Cart } from "../models/cartSchema.js";
import { Category } from "../models/cagtegorySchema.js";
import {v2 as cloudinary} from "cloudinary"



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
    const {otp,email}=req.body;
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

// export const addReview=catchAsyncError(async(req,res,next) =>{
//     const {id}=req.params;
//     const {description,star,title}=req.body;
//     if(!mongoose.Types.ObjectId.isValid(id))
//         return next(new ErrorHandler("Id format is invalid",400));
//     const post=await Post.findById(id);
//     if(!post)
//         return next(new ErrorHandler("Post not found!",404));
//     const user=req.user;
//     if(!user)
//         return next(new ErrorHandler("Please Loggin",404));
//     if(!description || !star || !title)
//         return next(new ErrorHandler("Please provide all details",400));
//     const imagePaths = req.files.map(file => file.path);
//     const review = await Review.create({
//        description,star,userId:user._id,postId:post._id,images:imagePaths,title
//       });
//       res.status(201).json({
//         success:true,
//         message:"Review Created",
//         review
//       })
// })


// export const addReview = catchAsyncError(async (req, res, next) => {
//     const { id } = req.params;
//     const { description, star, title } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return next(new ErrorHandler("Id format is invalid", 400));
//     }
    
//     const post = await Post.findById(id);
//     if (!post) {
//         return next(new ErrorHandler("Post not found!", 404));
//     }

//     const user = req.user;
//     if (!user) {
//         return next(new ErrorHandler("Please Log in", 404));
//     }

//     if (!description || !star || !title) {
//         return next(new ErrorHandler("Please provide all details", 400));
//     }

//     const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//     let uploadedImages = [];

//     if (req.files && req.files.length > 0) {
//         const imageUploadPromises = req.files.map(async (file) => {
//             if (!allowedFormats.includes(file.mimetype)) {
//                 throw new ErrorHandler("Image format not supported", 400);
//             }

//             const cloudinaryResponse = await cloudinary.uploader.upload(file.tempFilePath, { folder: "Review_Images" });
//             if (!cloudinaryResponse || cloudinaryResponse.error) {
//                 console.log("Cloudinary Error: ", cloudinaryResponse.error || "Unknown Cloudinary Error Happened!");
//                 throw new ErrorHandler("Failed to upload image to Cloudinary", 400);
//             }
//             return {
//                 public_id: cloudinaryResponse.public_id,
//                 url: cloudinaryResponse.secure_url
//             };
//         });

//         uploadedImages = await Promise.all(imageUploadPromises);
//     }

//     const review = await Review.create({
//         description,
//         star,
//         userId: user._id,
//         postId: post._id,
//         images: uploadedImages,
//         title
//     });

//     res.status(201).json({
//         success: true,
//         message: "Review Created",
//         review
//     });
// });


// export const addReview = catchAsyncError(async (req, res, next) => {
//     const { id } = req.params;
//     const { description, star, title } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return next(new ErrorHandler("Id format is invalid", 400));
//     }
    
//     const post = await Post.findById(id);
//     if (!post) {
//         return next(new ErrorHandler("Post not found!", 404));
//     }

//     const user = req.user;
//     if (!user) {
//         return next(new ErrorHandler("Please Log in", 404));
//     }

//     if (!description || !star || !title) {
//         return next(new ErrorHandler("Please provide all details", 400));
//     }

//     const image = req.files && req.files.image 
//         ? (Array.isArray(req.files.image) 
//             ? req.files.image 
//             : [req.files.image])
//         : [];

//     const MAX_IMAGES = 3;
//     if (image.length > MAX_IMAGES) 
//         return next(new ErrorHandler(`Maximum ${MAX_IMAGES} images allowed`, 400));

//     const allowedFormats = new Set(["image/png", "image/jpeg", "image/webp"]);
//     if (image.some(img => !allowedFormats.has(img.mimetype)))
//         return next(new ErrorHandler("Some image formats are not supported", 400));

//     const review = await Review.create({
//         description,
//         star,
//         userId: user._id,
//         postId: post._id,
//         images: image.length > 0 
//             ? image.map(img => ({ public_id: "temp", url: img.tempFilePath }))
//             : [],
//         title
//     });

//     res.status(201).json({
//         success: true,
//         message: "Review Created",
//         review
//     });

//     if (image.length > 0) {
//         const uploadPromises = image.map(image =>
//             cloudinary.uploader.upload(image.tempFilePath, { folder: "Review_Images" })
//         );

//         const cloudinaryResults = await Promise.allSettled(uploadPromises);

//         const uploadedImages = cloudinaryResults
//             .filter(res => res.status === "fulfilled" && res.value)
//             .map(res => ({
//                 public_id: res.value.public_id,
//                 url: res.value.secure_url
//             }));

//         if (uploadedImages.length > 0) {
//             await Review.findByIdAndUpdate(review._id, { images: uploadedImages });
//         }
//     }
// });

// export const addReview = catchAsyncError(async (req, res, next) => {
//     const { id } = req.params;
//     const { description, star, title } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return next(new ErrorHandler("Id format is invalid", 400));
//     }

//     const user = req.user;
//     if (!user) {
//         return next(new ErrorHandler("Please Log in", 404));
//     }

//     if (!description || !star || !title) {
//         return next(new ErrorHandler("Please provide all details", 400));
//     }

//     // Extract images if uploaded
//     const images = req.files?.images
//         ? (Array.isArray(req.files.images) ? req.files.images : [req.files.images])
//         : [];

//     const MAX_IMAGES = 3;
//     if (images.length > MAX_IMAGES) 
//         return next(new ErrorHandler(`Maximum ${MAX_IMAGES} images allowed`, 400));

//     const allowedFormats = new Set(["image/png", "image/jpeg", "image/webp"]);
//     if (images.some(img => !allowedFormats.has(img.mimetype))) 
//         return next(new ErrorHandler("Some image formats are not supported", 400));

//     // Create a review entry with temporary image paths
//     const review = await Review.create({
//         description,
//         star,
//         userId: user._id,
//         postId: id,
//         images: images.map(img => ({ public_id: "temp", url: "" })),
//         title
//     });

//     res.status(201).json({
//         success: true,
//         message: "Review is being processed. Images will be uploaded shortly.",
//         review
//     });

//     // Background upload of images to Cloudinary
//     try {
//         const uploadPromises = images.map(img =>
//             cloudinary.uploader.upload(img.tempFilePath, { folder: "Review_Images" })
//         );

//         const results = await Promise.allSettled(uploadPromises);

//         const uploadedImages = results
//             .filter(res => res.status === "fulfilled")
//             .map(res => ({
//                 public_id: res.value.public_id,
//                 url: res.value.secure_url
//             }));

//         if (uploadedImages.length > 0) {
//             await Review.findByIdAndUpdate(review._id, { images: uploadedImages });
//         }
//     } catch (error) {
//         console.error("Cloudinary Upload Error:", error);
//     }
// });


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

// export const addToCart=catchAsyncError(async(req,res,next) =>{
//     const {id}=req.params;
//     const {quantity,customization,title,price}=req.body;
//     if(!mongoose.Types.ObjectId.isValid(id))
//         return next(new ErrorHandler("Id format is invalid",400));
//     const post=await Post.findById(id);
//     if(!post)
//         return next(new ErrorHandler("Post not found",404));
//     if(!quantity || !title || !price)
//         return next(new ErrorHandler("Please provide all details",400));
//     if(req.files && req.files.length>0)
//         return next(new ErrorHandler("Please provide Image",400));
//     const image=req.files.image;
//     const cloudinaryResponse= await cloudinary.uploader.upload(
//         image.tempFilePath,
//         {
//             folder:"Cart_Image"
//         }
//     );
//     if(!cloudinaryResponse || cloudinaryResponse.error){
//         console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
//         return next(new ErrorHandler("Failed to upload image top cloudinary",400));
//     }
    
//     const addToCart=await Cart.create({
//         userId:req.user._id,
//         postId:post._id,
//         customization,quantity,price,title,
//         Image:{
//             public_id:cloudinaryResponse.public_id,
//             url:cloudinaryResponse.secure_url
//         },
//     })
//     res.status(201).json({
//         success:true,
//         message:"Item added to cart",
//         addToCart,
//     })
// })

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

export const addReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { description, star, title } = req.body;

    // Validate Post ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Id format is invalid", 400));
    }

    const post = await Post.findById(id);
    const user = req.user;

    if (!post) {
        return next(new ErrorHandler("Post not found", 404));
    }

    if (!user) {
        return next(new ErrorHandler("Please log in", 401));
    }

    if (!description || !star || !title) {
        return next(new ErrorHandler("Please provide all details", 400));
    }

    // Debugging: Check received files
    console.log("Uploaded Files:", req.files);

    const images = req.files && req.files.images
        ? (Array.isArray(req.files.images) ? req.files.images : [req.files.images])
        : [];

    const MAX_IMAGES = 3;
    if (images.length > MAX_IMAGES) {
        return next(new ErrorHandler(`Maximum ${MAX_IMAGES} images allowed`, 400));
    }

    const allowedFormats = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (images.some(img => !allowedFormats.has(img.mimetype))) {
        return next(new ErrorHandler("Some image formats are not supported", 400));
    }

    // Debugging: Check temp file paths
    console.log("Temp File Paths:", images.map(img => img.tempFilePath));

    // 🔥 Upload images to Cloudinary
    let uploadedImages = [];
    try {
        for (const image of images) {
            console.log(`Uploading image: ${image.tempFilePath}`);

            const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "Review_Images"
            });

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.log("Cloudinary Error:", cloudinaryResponse.error || "Unknown error");
                return next(new ErrorHandler("Failed to upload image to Cloudinary", 400));
            }

            uploadedImages.push({
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            });
        }
    } catch (error) {
        console.log("Cloudinary Upload Catch Error:", error);
        return next(new ErrorHandler("Image upload failed", 500));
    }

    // Create review with uploaded images
    const review = await Review.create({
        description,
        star,
        userId: user._id,
        postId: id,
        images: uploadedImages,
        title
    });

    res.status(201).json({
        success: true,
        message: "Review added successfully!",
        review
    });
});








export const addToCart = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { quantity, customization, title, price,image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return next(new ErrorHandler("Invalid post ID format", 400));

    const post = await Post.findById(id);
    if (!post) return next(new ErrorHandler("Post not found", 404));

    if (!quantity || !title || !price || !image) 
        return next(new ErrorHandler("Please provide all required details", 400));



    // 🔥 Check if item already exists in the cart
    let cartItem = await Cart.findOne({ userId: req.user._id, postId: post._id });

    if (cartItem) {
        // If the item is already in the cart, update quantity and image
        cartItem.quantity += parseInt(quantity);
        cartItem.customization = customization;
        cartItem.price = price;
        cartItem.title = title;
        cartItem.Image = {
            public_id: image.public_id,
            url: image.url
        };
        await cartItem.save();
    } else {
        // If not in the cart, create a new cart item
        cartItem = await Cart.create({
            userId: req.user._id,
            postId: post._id,
            customization,
            quantity,
            price,
            title,
            Image: {
                public_id: image.public_id,
                url: image.url
            },
        });
    }

    res.status(201).json({
        success: true,
        message: "Item added to cart",
        cartItem,
    });
});







