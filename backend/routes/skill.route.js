import express from "express";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "../controllers/skillController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllSkills); 

router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);
router.patch("/reorder", protect, reorderSkills);

export default router;
