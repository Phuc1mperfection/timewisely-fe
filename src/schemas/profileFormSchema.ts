import { z } from "zod";

export const profileFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
