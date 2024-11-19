import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import multer from "multer";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();
const PORT = process.env.PORT || 999;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// middlewares

const corsOptions = {
  origin: ["https://merntask-taupe.vercel.app", "http://localhost:5173"],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("*", (req, res) => {
  res.status(404).send({
    success: false,
    message: "Page Not Exists!",
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
