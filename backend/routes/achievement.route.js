import { Router } from "express";

import protect from "../middleware/authMiddleware.js";
import { uploadAchievementImage } from "../middleware/uploadMiddleware.js";

import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

const router = Router();

router.get("/", getAllAchievements);

//admin
router.post("/", protect, uploadAchievementImage, createAchievement);
router.put("/:id", protect, uploadAchievementImage, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

export default router;
