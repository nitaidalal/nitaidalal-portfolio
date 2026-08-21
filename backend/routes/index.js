import express from "express";

import authRoutes from "./auth.route.js";
import profileRoutes from "./profile.route.js";
import projectRoutes from "./project.route.js";
import skillRoutes from "./skill.route.js";
import educationRoutes from "./education.route.js";
import certRoutes from "./certification.route.js";
import achievementRoutes from "./achievement.route.js";
import contactRoutes from "./contact.route.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/profile", profileRoutes);
router.use("/api/projects", projectRoutes);
router.use("/api/skills", skillRoutes);
router.use("/api/education", educationRoutes);
router.use("/api/certifications", certRoutes);
router.use("/api/achievements", achievementRoutes);
router.use("/api/contact", contactRoutes);

export default router;
