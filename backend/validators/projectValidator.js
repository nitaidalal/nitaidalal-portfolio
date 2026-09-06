import { z } from "zod";

const normalizeEmptyString = (value) =>
  value === "" || value === null ? undefined : value;

// ─────────────────────────────────────────────
// Allows:
// ✅ valid URL
// ✅ undefined
// ✅ ""
// ─────────────────────────────────────────────
const optionalUrl = (message) =>
  z.preprocess(
    normalizeEmptyString,
    z.string().url({ message }).optional(),
  );

// ─────────────────────────────────────────────
// endDate >= startDate
// ─────────────────────────────────────────────
const validateProjectDates = (data) => {
  if (!data.startDate || !data.endDate) {
    return true;
  }

  return data.endDate >= data.startDate;
};

const baseProjectSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(3, {
      message: "Title must be at least 3 characters",
    })
    .max(100, {
      message: "Title must be at most 100 characters",
    }),

  shortDescription: z
    .string({
      required_error: "Short description is required",
    })
    .trim()
    .min(10, {
      message: "Short description must be at least 10 characters",
    })
    .max(200, {
      message: "Short description must be at most 200 characters",
    }),

  description: z.preprocess(
    normalizeEmptyString,
    z
      .string()
      .trim()
      .max(5000, {
        message: "Description must be at most 5000 characters",
      })
      .optional(),
  ),

  techTags: z
    .array(
      z.string().trim().min(1, {
        message: "Tech tag cannot be empty",
      }),
    )
    .min(1, {
      message: "At least one tech tag is required",
    })
    .default([]),

  category: z
    .enum(["Full Stack", "Frontend", "Backend", "Mobile", "Machine Learning","AI"], {
      required_error: "Category is required",
      invalid_type_error: "Invalid category",
    })
    .default("Full Stack"),

  imageUrl: optionalUrl("Invalid image URL"),

  imagePublicId: z.string().trim().optional(),

  liveUrl: optionalUrl("Invalid live URL"),

  repoUrl: optionalUrl("Invalid repository URL"),

  startDate: z.preprocess(
    normalizeEmptyString,
    z.coerce
      .date({
        invalid_type_error: "Start date must be a valid date",
      })
      .optional(),
  ),

  endDate: z.preprocess(
    normalizeEmptyString,
    z.coerce
      .date({
        invalid_type_error: "End date must be a valid date",
      })
      .nullable()
      .optional(),
  ),

  isFeatured: z.boolean().default(false),

  isPublished: z.boolean().default(false),

  publishedAt: z.coerce
    .date({
      invalid_type_error: "Published date must be a valid date",
    })
    .nullable()
    .default(null),
});

export const createProjectSchema = baseProjectSchema.refine(
  validateProjectDates,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  },
);

export const updateProjectSchema = baseProjectSchema
  .partial()
  .refine(validateProjectDates, {
    message: "End date must be after start date",
    path: ["endDate"],
  });
