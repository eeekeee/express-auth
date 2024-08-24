// import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes";
import connectMongoDB from "./db/connectMongoDB";

// dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectMongoDB();
});
