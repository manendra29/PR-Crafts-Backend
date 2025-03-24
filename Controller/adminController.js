import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import {v2 as cloudinary} from "cloudinary"
import { Post} from "../models/postSchema.js";
import mongoose from "mongoose";
import { Category } from "../models/cagtegorySchema.js";
import { Slider } from "../models/sliderSchema.js";



// export const createPost = catchAsyncError(async (req,res,next) => {
//     const {id}=req.params;
//     if(!req.files || Object.keys(req.files).length === 0 )
//         return next(new ErrorHandler("Post Image is Needed",400));
//      const {postImage}=req.files;
//      const allowedFormart=["image/png","image/jpeg","image/webp"];
//      if(!allowedFormart.includes(postImage.mimetype))
//          return next(new ErrorHandler("Post Image format not supported",400));
//      const category=await Category.findById(id);
//      if(!category)
//         return next(new ErrorHandler("No category found",404));
//     const {title,description,size,specification,price} = req.body;
//     if(!title || !description || !price || !size || !specification || !quantity)
//             return next(new ErrorHandler("Enter the Complete details",400));
//     const cloudinaryResponse= await cloudinary.uploader.upload(
//         postImage.tempFilePath,
//         {
//             folder:"Post_Images"
//         }
//     );
//     if(!cloudinaryResponse || cloudinaryResponse.error){
//         console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
//         return next(new ErrorHandler("Failed to upload image top cloudinary",400));
//     }
//     const userPost = await Post.create({
//         title,description,postImage:{
//             public_id:cloudinaryResponse.public_id,
//             url:cloudinaryResponse.secure_url
//         },
//         price,specification,size,categoryId:id,quantity
//     });
//     res.status(201).json({
//         success:true,
//         message:"Post created",
//         userPost
//     });
// });

export const deletePost=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    if(!post)
        return next(new ErrorHandler("Post not Found",404));

    const deletedPost=await Post.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Post Deleted Successfully",
        deletePost
    })
});

export const allProducts=catchAsyncError( async (req,res,next)=>{
    const posts = await Post.find({ category: { $ne: "Slider" } });
    res.status(201).json({
        success:true,
        message:"My Posts fetched!",
        posts
    });
});

export const categoryProduct=catchAsyncError( async (req,res,next)=>{
    const {title}=req.params;
    const category = await Category.findOne({ title});
    if (!category) {
        return next(new ErrorHandler("No Category Found",404));
    }
    const posts = await Post.find({categoryId:category._id});
    res.status(201).json({
        success:true,
        message:"Category Posts fetched!",
        posts
    });
});


export const updatePost = catchAsyncError(async (req,res,next)=> {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findByIdAndUpdate(id,req.body,{
        new :true,
        runValidators :true,
        useFindAndModify :false
    });
    res.status(201).json({
        success:true,
        message:"Data Updated",
        post
    });
})


// export const removePostImage = catchAsyncError(async (req, res, next) => {
//     const { id, imageId } = req.params; 

//     let post = await Post.findById(id);
//     if (!post) return next(new ErrorHandler("Post not found", 404));

//     const imageToRemove = post.postImage.find(img => img._id.toString() === imageId);
//     if (!imageToRemove) return next(new ErrorHandler("Image not found in post", 404));

//     await cloudinary.uploader.destroy(imageToRemove.public_id);

//     post = await Post.findByIdAndUpdate(
//         id,
//         { $pull: { postImage: { _id: imageId } } },
//         { new: true }
//     );

//     res.status(200).json({
//         success: true,
//         message: "Image removed successfully",
//         post,
//     });
// });


// export const addCategoty=catchAsyncError(async(req,res,next) =>{
//     const {title,description}=req.body;

//     if(!req.files || Object.keys(req.files).length === 0 )
//         return next(new ErrorHandler("Post Image is Needed",400));
//      const {image}=req.files;
//      const allowedFormart=["image/png","image/jpeg","image/webp"];
//      if(!allowedFormart.includes(image.mimetype))
//          return next(new ErrorHandler("Post Image format not supported",400));

//     if(!title || !description)
//             return next(new ErrorHandler("Enter the Complete details",400));
//     const cloudinaryResponse= await cloudinary.uploader.upload(
//         image.tempFilePath,
//         {
//             folder:"Category_Images"
//         }
//     );
//     if(!cloudinaryResponse || cloudinaryResponse.error){
//         console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
//         return next(new ErrorHandler("Failed to upload image top cloudinary",400));
//     }

//     const category=await Category.create({
//         title,description,image:{
//             public_id:cloudinaryResponse.public_id,
//             url:cloudinaryResponse.secure_url
//         },
//     });

//     res.status(201).json({
//         success:true,
//         message:"Category Created!",
//         category
//     });
// })

export const updateCategory = catchAsyncError(async (req,res,next)=> {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const category=await Category.findByIdAndUpdate(id,req.body,{
        new :true,
        runValidators :true,
        useFindAndModify :false
    });
    res.status(201).json({
        success:true,
        message:"Category Updated",
        category
    });
})

export const deleteCategory=catchAsyncError(async(req,res,next) =>{ 
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    
        const category=await Category.findById(id);
        if(!category)
            return next(new ErrorHandler("Category not Found",404));

        await Category.findByIdAndDelete(id);
        res.status(201).json({
            success:true,
            message:"Category deleted"
        })
})


export const getAllCategory=catchAsyncError(async(req,res,next) =>{
    const categories=await Category.find();
    res.status(201).json({
        success:true,
        message:"All categories",
        categories
    })
})



export const addCategory = catchAsyncError(async (req, res, next) => {
    try {
      const { title, description } = req.body;
  
      if (!req.file) return next(new ErrorHandler("Image is required!", 400));
      if (!title || !description) return next(new ErrorHandler("Enter complete details!", 400));
  
      const category = await Category.create({
        title,
        description,
        image:`/uploads/${req.file.filename}`,
      });
  
      res.status(201).json({
        success: true,
        message: "Category Created Successfully!",
        category
      });
  
    } catch (error) {
      return next(new ErrorHandler("Server Error!", 500));
    }
  });


export const getCategoryName= catchAsyncError(async(req,res,next) =>{
    const categoriesName = await Category.find().select('title');
    res.status(201).json({
        success:true,
        message:"All category name",
        categoriesName
    })
})


export const createPost = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    if (!req.files || req.files.length === 0) {
      return next(new ErrorHandler("Post Images are Needed", 400));
    }
    
    const category = await Category.findById(id);
    if (!category) {
      return next(new ErrorHandler("No category found", 404));
    }
    
    const { title, description, size, specification, price, quantity,tag , stock,discount } = req.body;
    if (!title || !description || !price || !size || !specification || !quantity || !tag || !stock || !discount) {
      return next(new ErrorHandler("Enter the Complete details", 400));
    }
    
    const imagePaths = req.files.map(file => file.path);
    
    const userPost = await Post.create({
      title,
      description,
      postImages: imagePaths,
      price,
      specification,
      size,
      categoryId: id,
      quantity,
      tag,
      stock,
      discount
    });
    
    res.status(201).json({
      success: true,
      message: "Post created",
      userPost
    });
  });


export const getSinglePost = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if  (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }
    res.status(200).json({
      success: true,
      post
    });
});
 


export const getSliders=catchAsyncError(async(req,res,next) =>{
    const sliders=await Slider.find();
    res.status(201).json({
        success:true,
        message:"All Sliders",
        sliders
    })
})

export const addSlider = catchAsyncError(async (req, res, next) => {
    
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Post Images are Needed", 400));
      }
      const {title}=req.body;
      if (!title) {
        return next(new ErrorHandler("Enter the Complete details", 400));
      }
    const imagePaths = req.files.map(file => file.path);
    const slider = await Slider.create({
      images: imagePaths,
      title
    });
    res.status(201).json({
        success:true,
        message:"Slider Created",
        slider
    })
}
);


export const deleteSilder=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    await Slider.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Slider Deleted",
    })
})