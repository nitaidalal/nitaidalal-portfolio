import express from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  updateResume
} from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";
import { uploadAvatar, uploadResume } from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.get("/", getProfile);
router.put("/", protect, updateProfile); 
router.put("/avatar", protect, uploadAvatar, updateAvatar); 
router.put("/resume", protect, uploadResume, updateResume);

export default router;