import { z} from 'zod';


const orderSchema = z
  .number({
    invalid_type_error: "Order must be a number",
  })
  .int({
    message: "Order must be an integer",
  })
  .min(0, {
    message: "Order cannot be negative",
  })
  .default(0);

export const createSkillSchema = z.object({
  name: z
    .string({
      required_error: "skill name is required",
      invalid_type_error: "skill name must be a string",
    })
    .trim(),

  category: z.enum(
    ["Languages", "Frameworks", "Databases", "Tools", "Devops"],
    {
      required_error: "category is required",
      invalid_type_error: "category must be one of the predefined categories",
    },
  ),

  iconSlug: z.string().trim().optional(),

  proficiencyPercentage: z
    .number({
      invalid_type_error: "Proficiency percentage must be a number",
    })
    .min(0, { message: "Proficiency percentage cannot be less than 0" })
    .max(100, { message: "Proficiency percentage cannot be greater than 100" }),

  skillOrder: orderSchema,
});


export const updateSkillSchema = createSkillSchema.partial();