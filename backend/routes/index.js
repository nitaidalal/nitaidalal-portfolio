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

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/skills", skillRoutes);
router.use("/education", educationRoutes);
router.use("/certifications", certRoutes);
router.use("/achievements", achievementRoutes);
router.use("/contact", contactRoutes);

export default router;
