import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import {dbConnect} from "./database/dbConnect.js";
import userRoute from "./Routes/userRoute.js";
import postRoute from "./Routes/postRoute.js";

config({
    path:"./config/config.env"
})
const app=express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["POST","GET","DELETE","PUT"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);

dbConnect();



export default app; 