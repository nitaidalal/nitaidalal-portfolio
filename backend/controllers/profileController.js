import Profile from "../models/profile.model.js";
import {updateProfileSchema} from "../validators/profileValidator.js"
import {successResponse,errorResponse} from "../utils/apiResponse.js"
import { cloudinary } from "../config/cloudinary.js";

// ─── @route  GET /api/profile ─────────────────────────
// ─── @access Public ───────────────────────────────────
export const getProfile = async(req,res,next) => {
    try {
        const profile = await Profile.findOne();

        if(!profile){
            return errorResponse(res,404,"Profile not found");
        }
        return successResponse(res,200,"Profile retrieved successfully",profile);
    } catch (error) {
        next(error);
    }
}

// ─── @route  PUT /api/profile ─────────────────────────
// ─── @access Private ──────────────────────────────────
export const updateProfile = async(req,res,next) => {
    try {
        const result = updateProfileSchema.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.errors.map((e) => e.message);
          return errorResponse(res, 400, errors[0]);
        }

        const profile = await Profile.findOne();

        if (!profile) {
          return errorResponse(res, 404, "Profile not found");
        }

        const profile = await Profile.findOneAndUpdate(
            {},
            { $set: result.data },
            { new: true, upsert: true, runValidators: true }
        );

        return successResponse(res, 200, "Profile updated successfully", profile);
    } catch (error) {
        next(error);
    }
}

// ─── @route  POST /api/profile/avatar ─────────────────────────
// ─── @access Private ──────────────────────────────────
export const updateAvatar = async(req,res,next) => {
    try {
        if(!req.file){
            return errorResponse(res,400,"No file uploaded");
        }

        const profile = await Profile.findOne();

        if(!profile){
            return errorResponse(res,404,"Profile not found");
        }

        if(profile?.avatarPublicId){
            try {
                await cloudinary.uploader.destroy(
                  profile.avatarPublicId
                );
              } catch (err) {
                console.error(
                  "Failed to delete old avatar:",
                  err.message
                );
              }
        }

        const updatedprofile = await Profile.findOneAndUpdate(
            {},
            {
                $set:{
                    avatarUrl:req.file.path,
                    avatarPublicId:req.file.filename,
                },
            },
            {new:true, upsert:true}

        )

        return successResponse(res,200,"Avatar updated successfully", {avatarUrl:updatedprofile.avatarUrl});
        
    } catch (error) {
        next(error);
    }
}

// ─── @route  PUT /api/profile/resume ─────────────────
// ─── @access Private ──────────────────────────────────
export const updateResume = async(req,res,next) => {
    try {
        if(!req.file){
            return errorResponse(res,400,"No pdf file uploaded");
        }

        const profile  = await Profile.findOne();
        if(!profile){
            return errorResponse(res,404,"Profile not found");
        }

        if(profile?.resumePublicId){
            try {
                await cloudinary.uploader.destroy(profile.resumePublicId,
                    { resource_type: "raw" } //PDF is treated as raw file in Cloudinary
                );
            } catch (error) {
                console.error("Failed to delete old resume:", error.message);
            }
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            {},
            {
                $set:{
                    resumeUrl:req.file.path,
                    resumePublicId:req.file.filename,
                }
            },
            { new: true , upsert:true}
        );

        return successResponse(res,200,"Resume updated successfully",{resumeUrl:updatedProfile.resumeUrl});

    } catch (error) {
        next(error);
    }
}
