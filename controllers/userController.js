"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.followUnFollowUser = exports.getUserProfile = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ username: req.params.username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in getUserProfile controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUserProfile = getUserProfile;
const followUnFollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userIdToFollow = new mongoose_1.Types.ObjectId(id);
        const user = yield userModel_1.default.findById(req.user._id);
        const userToFollow = yield userModel_1.default.findById(userIdToFollow);
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }
        if (!userToFollow || !user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isFollowing = user.following.includes(userIdToFollow);
        if (isFollowing) {
            // unfollow
            yield userModel_1.default.findByIdAndUpdate(userIdToFollow, {
                $pull: { followers: req.user._id },
            });
            yield userModel_1.default.findByIdAndUpdate(req.user._id, {
                $pull: { following: userIdToFollow },
            });
        }
        else {
            // follow
            yield userModel_1.default.findByIdAndUpdate(userIdToFollow, {
                $push: { followers: req.user._id },
            });
            yield userModel_1.default.findByIdAndUpdate(req.user._id, {
                $push: { following: userIdToFollow },
            });
        }
        return res
            .status(200)
            .json({ message: isFollowing ? "Unfollowed user" : "Followed user" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in followUnFollowUser controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.followUnFollowUser = followUnFollowUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fullname, email, username, currentPassword, newPassword, introduce } = req.body;
    let { profileImg } = req.body;
    const userId = req.user._id;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if ((!newPassword && currentPassword) ||
            (newPassword && !currentPassword)) {
            return res
                .status(400)
                .json({ error: "Please provide both current and new password" });
        }
        if (currentPassword && newPassword) {
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid password" });
            }
            if (newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ error: "Password must be at least 6 characters long" });
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.password = yield bcryptjs_1.default.hash(newPassword, salt);
        }
        if (profileImg) {
            // cloudinary upload
            if (user.profileImg) {
                const publicId = (_a = user.profileImg.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
                if (publicId) {
                    yield cloudinary_1.v2.uploader.destroy(publicId, {});
                }
            }
            const result = yield cloudinary_1.v2.uploader.upload(profileImg);
            profileImg = result.secure_url;
        }
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.introduce = introduce || user.introduce;
        user.profileImg = profileImg || user.profileImg;
        yield (user === null || user === void 0 ? void 0 : user.save());
        user.password = "";
        return res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in updateUserProfile controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateUserProfile = updateUserProfile;
