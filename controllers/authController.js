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
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../lib/utils/generateToken");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullname, email, password } = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingUser = yield userModel_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        const existingEmail = yield userModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters long" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new userModel_1.default({
            fullname,
            username,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in signup controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        (0, generateToken_1.generateTokenAndSetCookie)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            introduce: user.introduce,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in login controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in logout controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.logout = logout;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = yield userModel_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in getMe controller: ${error.message}`);
        }
        else {
            console.error("An unknown error occurred");
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMe = getMe;
