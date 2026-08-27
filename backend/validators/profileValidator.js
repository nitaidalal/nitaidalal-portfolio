import {z} from "zod";

const optionalUrl = (message) =>
  z.string().url({ message }).optional();

const basicOptionalValidation = z.string().trim().optional(); 

export const ProfileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),

  role: z.string().trim().optional().or(z.literal("")),
  education: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),

  taglines: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: "Tagline cannot be empty" })
        .max(30, { message: "Tagline must be at most 30 characters" }),
    )
    .max(5, { message: "You can have at most 5 taglines" })
    .optional(),

  heroSubtitle: z
    .string()
    .trim()
    .min(10, { message: "Hero subtitle must be at least 10 characters" })
    .max(200, { message: "Hero subtitle must be at most 200 characters" })
    .optional(),

  avatarUrl: optionalUrl("Invalid avatar URL"),

  avatarPublicId: basicOptionalValidation,

  resumeUrl: optionalUrl("Invalid resume URL"),

  resumePublicId: basicOptionalValidation,

  bio: basicOptionalValidation,

  currentlyLearning: basicOptionalValidation,

  currentlyBuilding: basicOptionalValidation,

  funFact: basicOptionalValidation,

  location: basicOptionalValidation,

  // ─── Contact & Socials ─────────────────────────────
  email: z.string().email({ message: "Invalid email address" }).optional(),

  social_links: z.object({
    github: optionalUrl("Invalid GitHub URL"),
    linkedin: optionalUrl("Invalid LinkedIn URL"),
    twitter: optionalUrl("Invalid Twitter URL"),
    instagram: optionalUrl("Invalid Instagram URL"),
    leetcode: optionalUrl("Invalid LeetCode URL"),
  }),

  // ─── SEO ───────────────────────────────────────────
  seoTitle: basicOptionalValidation,

  seoDescription: basicOptionalValidation,
});

export const updateProfileSchema = ProfileSchema.partial();