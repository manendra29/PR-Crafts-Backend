import express from "express";
const router=express.Router();
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { addCategory, addSlider, allProducts, categoryProduct, createPost, deleteCategory, deletePost, deleteSilder, getAllCategory, getCategoryName, getSinglePost, getSliders, updateCategory, updatePost } from "../Controller/adminController.js";
import { isAuthorized } from "../Middleware/isAuthenticated.js";
import { deleteReview } from "../Controller/userController.js";

router.post("/createpost/:id",isAuthenticated,isAuthorized("Admin"),createPost);
router.post("/addslider",isAuthenticated,isAuthorized("Admin"),addSlider);
router.delete("/deletepost/:id",isAuthenticated,isAuthorized("Admin"),deletePost);
router.get("/allproducts",allProducts);
router.get("/category/:title",categoryProduct);
router.put("/updatepost/:id",isAuthenticated,isAuthorized("Admin"),updatePost);
// router.put("/deletepostimage/:id/:imageId",isAuthenticated,isAuthorized("Admin"),removePostImage);
router.post("/addcategory",isAuthenticated,isAuthorized("Admin"),addCategory);
router.put("/updatecategory/:id",isAuthenticated,isAuthorized("Admin"),updateCategory);
router.delete("/deletecategory/:id",isAuthenticated,isAuthorized("Admin"),deleteCategory);
router.get("/allcategory",getAllCategory);
router.get("/categoryname",getCategoryName);
router.get("/showpost/:id",getSinglePost);
router.get("/slider",getSliders);
router.delete("/deleteslider/:id",isAuthenticated,deleteSilder);



export default router;