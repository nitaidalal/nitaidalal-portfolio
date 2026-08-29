import express from "express";
import { chat } from "../controllers/chatController.js";
import rateLimit from "express-rate-limit";

// limit chat to 30 messages per 10 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many messages, please slow down",
  },
});

const router = express.Router();

router.post("/", chat);

export default router;
