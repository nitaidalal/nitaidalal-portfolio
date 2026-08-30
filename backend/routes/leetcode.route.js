import express from "express";
import { getLeetCodeStats } from "../controllers/leetcodeController.js";
import rateLimit from "express-rate-limit";

const leetcodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 20,
  message: { success: false, message: "Too many requests" },
});

const router = express.Router();

router.get("/:username", leetcodeLimiter, getLeetCodeStats);

export default router;
