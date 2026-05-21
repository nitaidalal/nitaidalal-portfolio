import express from "express";
import {  getMe, logoutAdmin, loginAdmin, changePassword } from "../controllers/authController.js";
import  protect  from "../middleware/authMiddleware.js";
import {loginLimiter} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin); //public

//protected routes
router.post("/logout",protect,logoutAdmin);  
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);4

export default router;
