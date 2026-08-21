import {Router} from "express";
import protect from "../middleware/authMiddleware.js";
import {createEducation,deleteEducation,getAllEducation,updateEducation} from "../controllers/educationController.js"

const router = Router();

router.get("/", getAllEducation);
router.post("/", protect, createEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

export default router;