import express from "express";
import {
  updateAvatar,
  updateProfile,
  updateResume,
} from "../../controllers/profileController.js";
import protect from "../../middleware/authMiddleware.js";
import { uploadAvatar, uploadResume } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect); // all routes below this line are protected

router.put("/",  updateProfile);
router.post("/avatar", uploadAvatar, updateAvatar);
router.post("/resume", uploadResume, updateResume);

export default router;
