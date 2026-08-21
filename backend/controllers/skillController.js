import Skill from "../models/skills.model.js";
import {
  createSkillSchema,
  updateSkillSchema,
} from "../validators/skillValidator.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

//public route
//--------- GET /api/skills---------
export const getAllSkills = async (req, res, next) => {
  try {
    const allSkills = await Skill.find().sort({ skillOrder: 1 });

    // group by category for frontend rendering
    const groupedSkills = allSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {}); //empty object means initial value of acc is empty object
    return successResponse(res, 200, "Skills fetched", {
      allSkills,
      groupedSkills,
    });
  } catch (err) {
    next(err);
  }
};

//admin route
//--------- POST /api/skills---------
export const createSkill = async (req, res, next) => {
  try {
    const result = createSkillSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);

      return errorResponse(res, 400, errors[0]);
    }

    const skill = await Skill.create(result.data);

    return successResponse(res, 201, "Skill added successfully", { skill });
  } catch (err) {
    next(err);
  }
};

// ─── @route  POST /api/skills ─────────────────────────
export const updateSkill = async(req,res,next) => {
    try {
        const result = updateSkillSchema.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.issues.map((e) => e.message);
          return errorResponse(res, 400, errors[0]);
        }

        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { $set: result.data},
            { new: true, runValidators: true }
        );

        if(!skill){
            return errorResponse(res,404,"Skill not found");
        }

        return successResponse(res,200,"Skill updated successfully",skill);
    } catch (error) {
        next(error);
    }
}

// ─── @route  DELETE /api/skills/:id ──────────────────
export const deleteSkill = async(req,res,next) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);

        if(!skill){
            return errorResponse(res,404,"Skill not found");
        }

        return successResponse(res,200,"Skill deleted successfully",skill);
    } catch (error) {
        next(error);
    }
}

// ─── @route  PATCH /api/skills/reorder ───────────────
export const reorderSkills = async (req,res,next) => {
    try {
        const {category, skills} = req.body;

        if (!category) {
          return errorResponse(res, 400, "Category is required");
        }

        if (!Array.isArray(skills) || skills.length === 0) {
          return errorResponse(res, 400, "Skills must be a non-empty array");
        }

        const existingSkills = await Skill.find({
            _id: { $in: skills },
            category,
        }).select("_id");

        if (existingSkills.length !== skills.length) {
          return errorResponse(
            res,
            400,
            "Some skills do not belong to the selected category",
          );
        }

        const operations = skills.map((skillId, index) => ({
            updateOne:{
                filter:{
                    _id: skillId,
                    category
                },
                update:{
                    $set: { skillOrder: index }
                }
            }
        }))
        await Skill.bulkWrite(operations);

        return successResponse(res,200,"Skills reordered successfully");

    } catch (error) {
        next(error);
    }
}