import {z} from 'zod';

export const createContactSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must be at most 100 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),

  subject: z
    .string()
    .trim()
    .max(200, { message: "Subject must be at most 200 characters" })
    .optional(),

  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(10, {
      message: "Message must be at least 10 characters",
    })
    .max(500, { message: "Message must be at most 500 characters" }),

});


export const updateContactSchema = createContactSchema.partial();