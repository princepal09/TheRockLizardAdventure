import z from 'zod';

export const galleryImageIdSchema = z.uuid('Invalid gallery image ID');

export const updateGalleryImageSchema = z
  .object({
    altText: z.string().max(255).nullable().optional(),
    caption: z.string().max(255).nullable().optional(),
    sortOrder: z.int32().nonnegative().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update');

export type UpdateGalleryImageDTO = z.infer<typeof updateGalleryImageSchema>;
export type CreateGalleryImageDTO = { imageUrl: string; imagePublicId: string };
