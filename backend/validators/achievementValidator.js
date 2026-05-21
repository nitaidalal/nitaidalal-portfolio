import {z} from 'zod';

const optionalUrl = (message) => z.string().url({ message }).optional();

const baseAchievementSchema = z.object({
  title: z
    .string({ required_error: "Achievement title is required" })
    .min(3, { message: "Achievement title must be at least 3 characters" })
    .max(100, { message: "Achievement title must be at most 100 characters" })
    .trim(),

  description: z
    .string()
    .trim()
    .min(10, { message: "Achievement description must be at least 10 characters" })
    .max(500, {
      message: "Achievement description must be at most 500 characters",
    })
    .optional(),

  date: z.coerce
    .date({
      invalid_type_error: "Achievement date must be a valid date",
    })
    .optional(),

  category: z
    .string()
    .trim()
    .min(3, { message: "Achievement category must be at least 3 characters" })
    .max(50, { message: "Achievement category must be at most 50 characters" })
    .optional(),

  imageUrl: optionalUrl("Invalid image URL"),

  imagePublicId: z.string().trim().optional(),

  proofLink: optionalUrl("Invalid proof link URL"),
});


export const createAchievementSchema = baseAchievementSchema;

export const updateAchievementSchema = baseAchievementSchema.partial();

