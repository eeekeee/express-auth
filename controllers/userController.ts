import { Request, Response } from "express";
import User from "../models/userModel";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

interface UpdateUserProfileRequestBody {
  fullname?: string;
  email?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  introduce?: string;
  profileImg?: string;
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in getUserProfile controller: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const followUnFollowUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userIdToFollow = new Types.ObjectId(id);
    const user = await User.findById(req.user._id);
    const userToFollow = await User.findById(userIdToFollow);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    if (!userToFollow || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = user.following.includes(userIdToFollow);

    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(userIdToFollow, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userIdToFollow },
      });
    } else {
      // follow
      await User.findByIdAndUpdate(userIdToFollow, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userIdToFollow },
      });
    }

    return res
      .status(200)
      .json({ message: isFollowing ? "Unfollowed user" : "Followed user" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in followUnFollowUser controller: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserProfile = async (
  req: Request<{}, {}, UpdateUserProfileRequestBody>,
  res: Response
) => {
  const { fullname, email, username, currentPassword, newPassword, introduce } =
    req.body;
  let { profileImg } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both current and new password" });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      // cloudinary upload
      if (user.profileImg) {
        const publicId = user.profileImg.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {});
        }
      }
      const result = await cloudinary.uploader.upload(profileImg);
      profileImg = result.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.introduce = introduce || user.introduce;
    user.profileImg = profileImg || user.profileImg;

    await user?.save();

    user.password = "";

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in updateUserProfile controller: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
