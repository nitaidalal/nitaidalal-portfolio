import express from "express";
import {getProfile, updateAvatar,updateProfile,updateResume} from"../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";
import {uploadAvatar,uploadResume} from "../middleware/uploadMiddleware.js"

const router = express.Router();

//public route  
router.get("/", getProfile);

//private routes
router.put("/", protect, updateProfile);
router.post("/avatar",protect,uploadAvatar,updateAvatar);
router.post("/resume",protect,uploadResume,updateResume);
