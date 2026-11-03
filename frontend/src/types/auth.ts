import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .pipe(z.email("Enter a valid email address.")),
  password: z
    .string()
    .min(1, { error: "Enter your password.", abort: true })
    .min(6, "Use at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type Admin = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RefreshResult = {
  accessToken: string;
};

export type LoginResult = RefreshResult & {
  admin: Admin;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type UpdateProfileInput = {
  name?: string;
  profileImage?: File;
};
