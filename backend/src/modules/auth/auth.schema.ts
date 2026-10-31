import z from 'zod';

export const loginUserSchema = z
  .object({
    email: z.email('Email is required'),
    password: z.string().min(6, 'Password must be atlease 6 characters long'),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    token: z.string(),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .optional(),
  })
  .strict();

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password must be atlease 6 characters long'),
    newPassword: z.string().min(6, 'Password must be atlease 6 characters long'),
  })
  .strict();

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),

  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export type loginUserDTO = z.infer<typeof loginUserSchema>;
export type refreshTokenDTO = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type updatePasswordDTO = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
