import Project from "../models/project.model.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { ProfileSchema, updateProfileSchema } from "../validators/profileValidator.js";

//pubic route
// GET / projects / featured;
export const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      isFeatured: true,
      isPublished: true,
    }).sort({ publishedAt: -1 });
    return successResponse(
      res,
      200,
      "Featured projects retrieved successfully",
      projects,
    );
  } catch (error) {
    next(error);
  }
};

//public route
// GET / projects;
export const getAllProjects = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = {
      isPublished: true,
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    return successResponse(res, 200, "Projects fetched", projects);
  } catch (error) {
    next(error);
  }
};


//GET /projects/:id
export const getProjectById = async (req,res,next) => {
    try {
        const { id } = req.params;
        const project = await Project.findById({ _id:id, isPublished: true });
        if (!project) {
            return errorResponse(res, 404, "Project not found");
        }
        return successResponse(res, 200, "Project fetched", project);
    } catch (error) {
        next(error);
    }
}

//private routes - for admin use only
// POST /api/projects — Create project
export const createProject = async (req,res,next) => {
    try {
      // techTags comes as JSON string from multipart/form-data
      if (req.body.techTags && typeof req.body.techTas === "string") {
        req.body.techTags = JSON.parse(req.body.techTags);
      }

      // booleans come as strigs from form-data,
      if (req.body.isFeatured !== undefined) {
        req.body.isFeatured = req.body.isFeatured === "true";
      }
      if (req.body.isPublished !== undefined) {
        req.body.isPublished = req.body.isPublished === "true";
      }

      const result = ProfileSchema.safeParse(req.body);

      if (!result.success) {
        //delete uploaded image from Cloudinary if validation fails
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.public_id);
        }
        const errors = result.error.errors.map((e) => e.message);
        return errorResponse(res, 400, errors[0]);
      }

      const projectData = { ...result.data };

      if (req.file) {
        projectData.imageUrl = req.file.path;
        projectData.imagePublicId = req.file.filename;
      }

      // set publishedAt timestamp if being published immediately
      if (projectData.isPublished) {
        projectData.publishedAt = new Date();
      }

      const project = await Project.create(projectData);

      return successResponse(res, 201, "Project created", project);
    } catch (error) {
        next(error);
    }
}








