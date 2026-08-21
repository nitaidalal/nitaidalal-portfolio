import {Router} from "express";
import protect from "../middleware/authMiddleware.js";
import {createCertification,deleteCertification,getAllCertifications,updateCertification} from "../controllers/certificationController.js"
import { uploadCertImage } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getAllCertifications);

//admin
router.post("/", protect, uploadCertImage, createCertification);
router.put("/:id", protect, uploadCertImage, updateCertification);
router.delete("/:id", protect, deleteCertification);
export default router;