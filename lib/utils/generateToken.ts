import { Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (
  userId: Types.ObjectId,
  res: Response
) => {
  const secretKey: string = process.env.JWT_SECRET || "JWT-SECRET-KEY";
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development", // 개발 환경에서 secure 옵션 비활성화
  });
};
