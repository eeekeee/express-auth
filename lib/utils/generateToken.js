"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookie = (userId, res) => {
    const secretKey = process.env.JWT_SECRET || "JWT-SECRET-KEY";
    const token = jsonwebtoken_1.default.sign({ userId }, secretKey, {
        expiresIn: "1h",
    });
    res.cookie("jwt", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development", // 개발 환경에서 secure 옵션 비활성화
    });
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
