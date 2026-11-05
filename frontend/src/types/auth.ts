import { z } from "zod";
import { imageFileSchema } from "@/lib/validation/image";

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

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(100, "Use at most 100 characters."),
  profileImage: imageFileSchema.optional(),
});

export const forgotPasswordEmailSchema = z
  .string()
  .trim()
  .pipe(z.email("Enter a valid email address."));
export const resetPasswordFormSchema = z.object({
  token: z.string().min(1, "The reset link is missing its token."),
  newPassword: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(100, "Use at most 100 characters."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Enter your current password (at least 6 characters)."),
    newPassword: z.string().min(6, "Use at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    path: ["confirmPassword"],
    message: "The new passwords do not match.",
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

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
