import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email address"),
  fullname: z.string().min(2, "Full name is required"),
  avatar: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
