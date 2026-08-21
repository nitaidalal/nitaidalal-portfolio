import { z } from "zod";

const optionalUrl = (message) => z.string().url({ message }).optional();

const baseCertificationSchema = z.object({
  title: z
    .string({
      required_error: "Certification title is required",
    })
    .trim()
    .min(3, {
      message: "Certification title must be at least 3 characters",
    })
    .max(150, {
      message: "Certification title must be at most 150 characters",
    }),

  issuer: z
    .string({
      required_error: "Issuer is required",
    })
    .trim()
    .min(2, {
      message: "Issuer name must be at least 2 characters",
    })
    .max(100, {
      message: "Issuer name must be at most 100 characters",
    }),

  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "Issue date must be a valid date",
  }),

  verificationUrl: optionalUrl("Invalid verification URL"),
});

export const createCertificationSchema = baseCertificationSchema;

export const updateCertificationSchema = baseCertificationSchema.partial();
