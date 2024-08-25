// import dotenv from "dotenv";
import "dotenv/config";
import express, { urlencoded } from "express";
import authRoutes from "./routes/authRoutes";
import connectMongoDB from "./db/connectMongoDB";
import cookieParser from "cookie-parser";

// dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectMongoDB();
});
