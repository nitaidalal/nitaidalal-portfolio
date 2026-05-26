import Project from "../models/project.model.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { createProjectSchema, updateProfileSchema } from "../validators/projectValidator.js";

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

// POST /api/projects 
export const createProject = async (req,res,next) => {
    try {
      if (req.body.techTags && typeof req.body.techTas === "string") {
        req.body.techTags = JSON.parse(req.body.techTags);
      }

      if (req.body.isFeatured !== undefined) {
        req.body.isFeatured = req.body.isFeatured === "true";
      }
      if (req.body.isPublished !== undefined) {
        req.body.isPublished = req.body.isPublished === "true";
      }

      const result = createProjectSchema.safeParse(req.body);

      if (!result.success) {
        if (req.file) {
          try {
          await cloudinary.uploader.destroy(req.file.filename);
          } catch {}
        }
        const errors = result.error.errors.map((e) => e.message);
        return errorResponse(res, 400, errors[0]);
      }

      const projectData = { ...result.data };

      if (req.file) {
        projectData.imageUrl = req.file.path;
        projectData.imagePublicId = req.file.filename;
      }

      if (projectData.isPublished) {
        projectData.publishedAt = new Date();
      }

      const project = await Project.create(projectData);

      return successResponse(res, 201, "Project created", project);
    } catch (error) {
        next(error);
    }
}

// Put /api/projects/:id 
export const updateProject = async (req,res,next) => {
  try{
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    if (req.body.techTags && typeof req.body.techTags === "string") {
      req.body.techTags = JSON.parse(req.body.techTags);
    }

    if (req.body.isFeatured !== undefined) {
      req.body.isFeatured = req.body.isFeatured === "true";
    }

    if (req.body.isPublished !== undefined) {
      req.body.isPublished = req.body.isPublished === "true";
    }

    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch {}
      }
      const errors = result.error.errors.map((e) => e.message);
      return errorResponse(res, 400, errors[0]);
    }

    const updateProjectData = { ...result.data };

    if (updateProjectData.isPublished && !project.isPublished) {
      updateProjectData.publishedAt = new Date();
    }

    if (req.file) {
      if (project.imagePublicId) {
        try{
        await cloudinary.uploader.destroy(project.imagePublicId);
        } catch{}
      }
      updateProjectData.imageUrl = req.file.path;
      updateProjectData.imagePublicId = req.file.filename;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateProjectData },
      { new: true, runValidators: true },
    );

    return successResponse(res,200,"Project updated",updatedProject);
  }catch(error){
    next(error);
  }
}


// DELETE /api/projects/:id 
export const deleteProject = async (req,res,next) => {
  try{
    const { id } = req.params;
    const project = await Project.findById(id);

    if(!project){
      return errorResponse(res,404,"Project not found");
    }

    if(project.imagePublicId){
      try{
        await cloudinary.uploader.destroy(project.imagePublicId);
      } catch{}
    }

    await Project.findByIdAndDelete(id);

    return successResponse(res,200,"Project deleted");
  }catch(error){
    next(error);
  }
}




