import { Router } from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createContact,
  getAllContacts,
  markAsRead,
  deleteContact,
} from "../controllers/contactController.js";

const router = Router();

// Public
router.post("/", createContact);

// Admin
router.get("/", protect, getAllContacts);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteContact);

export default router;
