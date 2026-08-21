import Certification from "../models/certification.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import {
  createCertificationSchema,
  updateCertificationSchema,
} from "../validators/certificationValidator.js";

// ─── GET /api/certifications ──────────────────────────
export const getAllCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({
      issueDate: -1,
    });

    return successResponse(
      res,
      200,
      "Certifications fetched successfully",
      certifications,
    );
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/certifications ─────────────────────────
export const createCertification = async (req, res, next) => {
  try {
    const result = createCertificationSchema.safeParse(req.body);

    if (!result.success) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }

      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const certificationData = {
      ...result.data,
    };

    if (req.file) {
      certificationData.imageUrl = req.file.path;
      certificationData.imagePublicId = req.file.filename;
    }

    const certification = await Certification.create(certificationData);

    return successResponse(
      res,
      201,
      "Certification created successfully",
      certification,
    );
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/certifications/:id ──────────────────────
export const updateCertification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findById(id);

    if (!certification) {
      return errorResponse(res, 404, "Certification not found");
    }

    const result = updateCertificationSchema.safeParse(req.body);

    if (!result.success) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }

      return errorResponse(res, 400, result.error.issues[0].message);
    }

    const updateData = {
      ...result.data,
    };

    if (req.file) {
      if (certification.imagePublicId) {
        await cloudinary.uploader.destroy(certification.imagePublicId);
      }

      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    return successResponse(
      res,
      200,
      "Certification updated successfully",
      updatedCertification,
    );
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/certifications/:id ───────────────────
export const deleteCertification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findById(id);

    if (!certification) {
      return errorResponse(res, 404, "Certification not found");
    }

    if (certification.imagePublicId) {
      await cloudinary.uploader.destroy(certification.imagePublicId);
    }

    await certification.deleteOne();

    return successResponse(res, 200, "Certification deleted successfully");
  } catch (error) {
    next(error);
  }
};
