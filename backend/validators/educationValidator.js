import { z } from "zod";

const orderSchema = z
  .number({
    required_error: "Order is required",
    invalid_type_error: "Order must be a number",
  })
  .int({
    message: "Order must be an integer",
  })
  .min(0, {
    message: "Order cannot be negative",
  })
  .default(0);

const baseEducationSchema = z.object({
  institution: z
    .string({
      required_error: "Institution name is required",
      invalid_type_error: "Institution name must be a string",
    })
    .trim()
    .min(1, {
      message: "Institution name cannot be empty",
    }),

  type: z.enum(["College", "School"], {
    required_error: "Education type is required",
    invalid_type_error: "Education type must be College or School",
  }),

  order: orderSchema,

  // College
  startYear: z
    .number({
      invalid_type_error: "Start year must be a number",
    })
    .int({
      message: "Start year must be an integer",
    })
    .optional(),

  endYear: z
    .number({
      invalid_type_error: "End year must be a number",
    })
    .int({
      message: "End year must be an integer",
    })
    .optional(),

  // School
  passingYear: z
    .number({
      invalid_type_error: "Passing year must be a number",
    })
    .int({
      message: "Passing year must be an integer",
    })
    .optional(),

  degree: z
    .string({
      invalid_type_error: "Degree must be a string",
    })
    .trim()
    .optional(),

  branch: z
    .string({
      invalid_type_error: "Branch must be a string",
    })
    .trim()
    .optional(),

  currentYear: z
    .string({
      invalid_type_error: "Current year must be a string",
    })
    .trim()
    .optional(),

  cgpa: z
    .number({
      invalid_type_error: "CGPA must be a number",
    })
    .min(0, {
      message: "CGPA cannot be negative",
    })
    .max(10, {
      message: "CGPA cannot be greater than 10",
    })
    .optional(),

  board: z
    .string({
      invalid_type_error: "Board must be a string",
    })
    .trim()
    .optional(),

  percentage: z
    .number({
      invalid_type_error: "Percentage must be a number",
    })
    .min(0, {
      message: "Percentage cannot be negative",
    })
    .max(100, {
      message: "Percentage cannot be greater than 100",
    })
    .optional(),

  standard: z
    .string({
      invalid_type_error: "Standard must be a string",
    })
    .trim()
    .optional(),
});

export const createEducationSchema = baseEducationSchema.superRefine(
  (data, ctx) => {
    // ─────────────────────────────────────────────
    // COLLEGE VALIDATION
    // ─────────────────────────────────────────────
    if (data.type === "College") {
      if (data.startYear === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["startYear"],
          message: "Start year is required for college",
        });
      }

      if (data.endYear === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["endYear"],
          message: "End year is required for college",
        });
      }

      if (!data.degree) {
        ctx.addIssue({
          code: "custom",
          path: ["degree"],
          message: "Degree is required for college",
        });
      }

      if (!data.branch) {
        ctx.addIssue({
          code: "custom",
          path: ["branch"],
          message: "Branch is required for college",
        });
      }
    }

    // ─────────────────────────────────────────────
    // SCHOOL VALIDATION
    // ─────────────────────────────────────────────
    if (data.type === "School") {
      if (data.passingYear === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["passingYear"],
          message: "Passing year is required for school",
        });
      }

      if (!data.board) {
        ctx.addIssue({
          code: "custom",
          path: ["board"],
          message: "Board is required for school",
        });
      }

      if (!data.standard) {
        ctx.addIssue({
          code: "custom",
          path: ["standard"],
          message: "Standard is required for school",
        });
      }
    }
  },
);

export const updateEducationSchema = baseEducationSchema
  .omit({
    type: true,
  })
  .partial();