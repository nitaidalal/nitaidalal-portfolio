import express from "express";
import {
  getAllProjects,
  getFeaturedProjects,
  getAdminAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";
import { uploadProjectImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/featured", getFeaturedProjects);
router.get("/admin/all", protect, getAdminAllProjects);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.post("/", protect,uploadProjectImage, createProject);
router.put("/:id", protect, uploadProjectImage, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
