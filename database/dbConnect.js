import mongoose from "mongoose";

export const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URI)
        .then(() => console.log("🔥 MongoDB Connected Successfully!"))
        .catch((err) => console.error("❌ MongoDB Connection Error:", err));
};
