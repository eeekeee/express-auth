import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  followUnFollowUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";

const router = express.Router();

router.get("/profile/:username", getUserProfile);

router.post("/follow/:id", protectRoute, followUnFollowUser);

router.post("/update", protectRoute, updateUserProfile);

export default router;
