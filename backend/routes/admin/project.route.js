import express from "express";
import {updateProject,createProject, deleteProject} from "../../controllers/projectController.js";\
import protect from "../../middleware/authMiddleware.js"

const router = express.Router();

router.use(protect); // all routes below this line are protected
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject); 

export default router;