import Contact from "../models/contact.model.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { sendEmail } from "../utils/sendMail.js";
import {
  userAutoReplyTemplate,
  adminNotificationTemplate,
  adminReplyTemplate,
} from "../utils/emailTemplates.js";

import { contactSchema } from "../validators/contactValidator.js";

// ─── POST /api/contact ─────────────────────────────────
export const createContact = async (req, res, next) => {
  try {
    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const message = await Contact.create(result.data);
    const { name, email, subject, message: msgText } = result.data;

    await Promise.all([
      sendEmail({
        to: email,
        subject: "Thanks for reaching out! — Nitai Dalal",
        html: userAutoReplyTemplate({ name, subject, message: msgText }),
      }),
      sendEmail({
        to: "dalalnitai7@gmail.com",
        subject: `New message from ${name} — Portfolio`,
        html: adminNotificationTemplate({
          name,
          email,
          subject,
          message: msgText,
        }),
      }),
    ]);

    return successResponse(res, 201, "Message sent successfully", message);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/contact ──────────────────────────────────
export const getAllContacts = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    const unreadCount = await Contact.countDocuments({ isRead: false });

    return successResponse(res, 200, "Messages fetched successfully", { unreadCount, messages });
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


export const replyToContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return errorResponse(res, 404, "Message not found");
    }

    // Send the reply email to the user
    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject || "Your message"} — Nitai Dalal`,
      html: adminReplyTemplate({
        userName: contact.name,
        originalMessage: contact.message,
        replyMessage,
      }),
    });

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isReplied: true,
          repliedAt: new Date(),
          replyMessage,
          isRead: true,
        },
      },
      { new: true },
    );

    return successResponse(res, 200, "Reply sent successfully", updated);

    
  } catch (error) {
    next(error);
  }
}