import z from 'zod';

export const teamMemberIdSchema = z.uuid('Invalid team member ID');

export const createTeamMemberSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    role: z.string().trim().min(1).max(100),
    bio: z
      .string()
      .trim()
      .max(1500)
      .transform((value) => value || null)
      .nullable()
      .optional(),
    qualifications: z
      .string()
      .trim()
      .max(500)
      .transform((value) => value || null)
      .nullable()
      .optional(),
    sortOrder: z
      .union([z.number(), z.string().regex(/^\d+$/).transform(Number)])
      .pipe(z.int32().nonnegative())
      .optional(),
    isActive: z
      .union([z.boolean(), z.stringbool({ truthy: ['true'], falsy: ['false'] })])
      .optional(),
  })
  .strict();

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type CreateTeamMemberDTO = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberDTO = z.infer<typeof updateTeamMemberSchema>;
