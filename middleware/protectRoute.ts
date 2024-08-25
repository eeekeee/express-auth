import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "You need to login first" });
    }

    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    console.log(decoded);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "No user found with this id" });
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error in protectRoute middleware: ${error.message}`);
    } else {
      console.error("An unknown error occurred in protectRoute middleware");
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
