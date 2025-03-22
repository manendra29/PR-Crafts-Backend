import express from "express";
const router=express.Router();
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { addReview, addToCart, cartSize, changeDp, deleteCartProduct, deleteReview, generateOTP, getProfile, getReviewsOfPost, login, logout, MyCart, productsTagLine, register, underPrice } from "../Controller/userController.js";
import upload from "../Middleware/multerConfig.js";


router.post("/otp",generateOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getProfile);
router.put("/dp",isAuthenticated,changeDp);
router.post("/createreview/:id",isAuthenticated,upload.array("images",3),addReview);
router.delete("/deletereview/:id",isAuthenticated,deleteReview);
router.post("/addtocart/:id",isAuthenticated,addToCart);
router.get("/under/:price",underPrice);
router.get("/bytag/:tag",productsTagLine);
router.get("/reviews/:id",getReviewsOfPost);
router.get("/cartsize",isAuthenticated,cartSize);
router.get("/mycart",isAuthenticated,MyCart);
router.delete("/deletecart/:id",isAuthenticated,deleteCartProduct);



export default router;