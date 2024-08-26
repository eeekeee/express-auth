// import dotenv from "dotenv";
import "dotenv/config";
import express, { urlencoded } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import connectMongoDB from "./db/connectMongoDB";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectMongoDB();
});
