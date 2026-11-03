import z from 'zod';

export const seasonIdSchema = z.uuid('Invalid season ID');

export const createSeasonSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().nullable().optional(),
    startMonth: z.int().min(1).max(12).nullable().optional(),
    endMonth: z.int().min(1).max(12).nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateSeasonSchema = createSeasonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update');

export type CreateSeasonDTO = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonDTO = z.infer<typeof updateSeasonSchema>;
