import express from "express";
import {
  getFeaturedProjects,
  getAllProjects,
  getProjectById,
} from "../../controllers/projectController.js";

const router = express.Router();

router.get("/featured", getFeaturedProjects);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

export default router;
