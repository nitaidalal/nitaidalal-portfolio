import Achievement from "../models/achievement.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

import {
  createAchievementSchema,
  updateAchievementSchema,
} from "../validators/achievementValidator.js";

// ─── GET /api/achievements ────────────────────────────
export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({
      date: -1,
    });

    return successResponse(
      res,
      200,
      "Achievements fetched successfully",
      achievements,
    );
  } catch (error) {
    next(error);
  }
};


// ─── POST /api/achievements ───────────────────────────
export const createAchievement = async (req, res, next) => {
    try {
        const result = createAchievementSchema.safeParse(req.body);

        if (!result.success) {
          if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
          }

          return errorResponse(res, 400, result.error.issues[0].message);
        }

        const achievementData = {
          ...result.data,
        };

        if (req.file) {
          achievementData.imageUrl = req.file.path;
          achievementData.imagePublicId = req.file.filename;
        }

        const achievement = await Achievement.create(achievementData);

        return successResponse(
          res,
          201,
          "Achievement created successfully",
          achievement,
        );
    } catch (error) {
        next(error);
    }
}

// ─── PUT /api/achievements/:id ─────────────────────────
export const updateAchievement = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const achievement = await Achievement.findById(id);
  
      if (!achievement) {
        return errorResponse(
          res,
          404,
          "Achievement not found"
        );
      } const result = updateAchievementSchema.safeParse(req.body);

      if (!result.success) {
          if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
  
        return errorResponse(
          res,
          400,
          result.error.issues[0].message
        );
      } const updateData = {
        ...result.data,
      };
  
      if (req.file) {
          if (achievement.imagePublicId) {
          await cloudinary.uploader.destroy(
            achievement.imagePublicId
          );
        }
  
        updateData.imageUrl = req.file.path;
        updateData.imagePublicId = req.file.filename;
      }

      const updatedAchievement =
      await Achievement.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

    return successResponse(
      res,
      200,
      "Achievement updated successfully",
      updatedAchievement
    );
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/achievements/:id ──────────────────────
export const deleteAchievement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const achievement = await Achievement.findById(id);

        if (!achievement) {
            return errorResponse(res, 404, "Achievement not found");
        }

        if (achievement.imagePublicId) {
            await cloudinary.uploader.destroy(achievement.imagePublicId);
        }

        await achievement.deleteOne();

        return successResponse(res, 200, "Achievement deleted successfully");
    } catch (error) {
        next(error);
    }
}