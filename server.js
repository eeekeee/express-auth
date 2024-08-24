"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import dotenv from "dotenv";
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const connectMongoDB_1 = __importDefault(require("./db/connectMongoDB"));
// dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);
app.use("/api/auth", authRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Server is ready");
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
    (0, connectMongoDB_1.default)();
});
