import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!file.mimetype || !allowedFormats.includes(file.mimetype)) {
      const error = new Error("Only .png, .jpeg, and .webp formats are allowed!");
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

export default upload;
