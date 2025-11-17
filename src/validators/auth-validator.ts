import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);
export const passwordSchema = z.string().trim().min(6);

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
