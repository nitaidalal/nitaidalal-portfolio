import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),

  email: z.string().email({ message: "Invalid email address" }),

  subject: z
    .string()
    .trim()
    .max(200, { message: "Subject must be at most 200 characters" })
    .optional(),

  message: z
    .string()
    .trim()
    .min(10, {
      message: "Message must be at least 10 characters",
    })
    .max(500, {
      message: "Message must be at most 500 characters",
    }),
});
