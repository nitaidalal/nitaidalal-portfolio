
import Education from "../models/education.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  createEducationSchema,
  updateEducationSchema,
} from "../validators/educationValidator.js";

// ─── @route  GET /api/education ───────────────────────
export const getAllEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({
      order: 1,
      startYear: -1,
    });

    return successResponse(
      res,
      200,
      "Education fetched successfully",
      education,
    );
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/education ──────────────────────
export const createEducation = async (req, res, next) => {
  try {
    const result = createEducationSchema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const education = await Education.create(result.data);

    return successResponse(
      res,
      201,
      "Education created successfully",
      education,
    );
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/education/:id ───────────────────
export const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return errorResponse(res, 404, "Education not found");
    }

    const result = updateEducationSchema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      { $set: result.data },
      {
        new: true,
        runValidators: true,
      },
    );

    return successResponse(
      res,
      200,
      "Education updated successfully",
      updatedEducation,
    );
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/education/:id ─────────────────
export const   deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return errorResponse(res, 404, "Education not found");
    }

    await education.deleteOne();

    return successResponse(res, 200, "Education deleted successfully");
  } catch (error) {
    next(error);
  }
};