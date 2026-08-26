import Contact from "../models/contact.model.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

import { contactSchema } from "../validators/contactValidator.js";

// ─── POST /api/contact ─────────────────────────────────
export const createContact = async (req, res, next) => {
  try {
    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const contact = await Contact.create(result.data);

    return successResponse(res, 201, "Message sent successfully", contact);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/contact ──────────────────────────────────
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return successResponse(res, 200, "Messages fetched successfully", contacts);
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/contact/:id/read ───────────────────────
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true },
    );

    if (!contact) {
      return errorResponse(res, 404, "Message not found");
    }

    return successResponse(res, 200, "Message marked as read", contact);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/contact/:id ────────────────────────────
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return errorResponse(res, 404, "Message not found");
    }

    return successResponse(res, 200, "Message deleted successfully");
  } catch (error) {
    next(error);
  }
};
