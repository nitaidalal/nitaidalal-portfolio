import { Router } from "express";
import {loginAdmin, getMe, logoutAdmin, changePassword} from "../controllers/authController.js"
import { loginLimiter } from "../middleware/rateLimiter.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginLimiter , loginAdmin);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutAdmin);
router.post("/change-password", protect, changePassword);    


export default router;