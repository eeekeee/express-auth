"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/profile/:username", userController_1.getUserProfile);
router.post("/follow/:id", protectRoute_1.protectRoute, userController_1.followUnFollowUser);
router.post("/update", protectRoute_1.protectRoute, userController_1.updateUserProfile);
exports.default = router;
