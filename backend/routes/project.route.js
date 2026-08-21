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

const router = express.Router();

router.get("/featured", getFeaturedProjects);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.get("/admin/all", protect, getAdminAllProjects);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
