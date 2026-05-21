import { z } from "zod";

// ─────────────────────────────────────────────
// Base Education Schema
// ─────────────────────────────────────────────
const baseEducationSchema = z.object({
  institution: z
    .string({
      required_error: "Institution name is required",
    })
    .trim()
    .min(2, {
      message: "Institution name must be at least 2 characters",
    })
    .max(150, {
      message: "Institution name must be at most 150 characters",
    }),

  type: z.enum(["School", "College"], {
    required_error: "Type is required",
    invalid_type_error: "Invalid education type",
  }),

  startYear: z.coerce
    .number({
      invalid_type_error: "Start year must be a number",
    })
    .int({
      message: "Start year must be an integer",
    })
    .min(1950, {
      message: "Start year is too old",
    })
    .max(new Date().getFullYear(), {
      message: "Start year cannot be in the future",
    })
    .optional(),

  endYear: z.coerce
    .number({
      invalid_type_error: "End year must be a number",
    })
    .int({
      message: "End year must be an integer",
    })
    .nullable()
    .optional(),

  order: z.coerce
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int({
      message: "Order must be an integer",
    })
    .min(0, {
      message: "Order cannot be negative",
    })
    .default(0),

  // ─────────────────────────────────────────
  // College Fields
  // ─────────────────────────────────────────
  degree: z
    .string()
    .trim()
    .max(100, {
      message: "Degree must be at most 100 characters",
    })
    .optional(),

  branch: z
    .string()
    .trim()
    .max(150, {
      message: "Branch must be at most 150 characters",
    })
    .optional(),

  currentYear: z
    .string()
    .trim()
    .max(50, {
      message: "Current year must be at most 50 characters",
    })
    .optional(),

  cgpa: z.coerce
    .number({
      invalid_type_error: "CGPA must be a number",
    })
    .min(0, {
      message: "CGPA cannot be negative",
    })
    .max(10, {
      message: "CGPA cannot exceed 10",
    })
    .nullable()
    .optional(),

  // ─────────────────────────────────────────
  // School Fields
  // ─────────────────────────────────────────
  board: z
    .string()
    .trim()
    .max(100, {
      message: "Board name must be at most 100 characters",
    })
    .optional(),

  percentage: z.coerce
    .number({
      invalid_type_error: "Percentage must be a number",
    })
    .min(0, {
      message: "Percentage cannot be negative",
    })
    .max(100, {
      message: "Percentage cannot exceed 100",
    })
    .nullable()
    .optional(),

  standard: z
    .string()
    .trim()
    .max(20, {
      message: "Standard must be at most 20 characters",
    })
    .optional(),
});

// ─────────────────────────────────────────────
// Conditional Validation
// ─────────────────────────────────────────────
const validateEducationByType = (data) => {
  // ───────────── College Validation ─────────────
  if (data.type === "College") {
    if (!data.degree || data.degree.trim() === "") {
      return false;
    }

    if (!data.branch || data.branch.trim() === "") {
      return false;
    }
  }

  // ───────────── School Validation ─────────────
  if (data.type === "School") {
    if (!data.board || data.board.trim() === "") {
      return false;
    }

    if (!data.standard || data.standard.trim() === "") {
      return false;
    }
  }

  return true;
};

// ─────────────────────────────────────────────
// Year Validation
// endYear >= startYear
// ─────────────────────────────────────────────
const validateYears = (data) => {
  if (!data.endYear) {
    return true;
  }

  return data.endYear >= data.startYear;
};

// ─────────────────────────────────────────────
// Create Education Schema
// ─────────────────────────────────────────────
export const createEducationSchema = baseEducationSchema

  // Type-based validation
  .refine(validateEducationByType, {
    message: "Required fields missing based on education type",
    path: ["type"],
  })

  // Year validation
  .refine(validateYears, {
    message: "End year cannot be before start year",
    path: ["endYear"],
  });

// ─────────────────────────────────────────────
// Update Education Schema
// ─────────────────────────────────────────────
export const updateEducationSchema = baseEducationSchema
  .partial()

  .refine(validateEducationByType, {
    message: "Required fields missing based on education type",
    path: ["type"],
  })

  .refine(validateYears, {
    message: "End year cannot be before start year",
    path: ["endYear"],
  });
