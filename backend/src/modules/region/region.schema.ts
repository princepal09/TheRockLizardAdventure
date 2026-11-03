import z from 'zod';

export const regionIdSchema = z.uuid('Invalid region ID');

export const createRegionSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    description: z.string().nullable().optional(),
    imageUrl: z.url().max(1000).nullable().optional(),
    isActive: z
      .union([z.boolean(), z.stringbool({ truthy: ['true'], falsy: ['false'] })])
      .optional(),
  })
  .strict();

export const updateRegionSchema = createRegionSchema.partial();

export type CreateRegionDTO = z.infer<typeof createRegionSchema>;
export type UpdateRegionDTO = z.infer<typeof updateRegionSchema>;
