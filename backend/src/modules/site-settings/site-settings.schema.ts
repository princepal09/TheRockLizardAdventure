import z from 'zod';

export const updateSiteSettingsSchema = z
  .object({
    logoUrl: z.url().max(1000).nullable().optional(),
    heroImageUrl: z.url().max(1000).nullable().optional(),
    contactEmail: z.email().max(255).nullable().optional(),
    contactPhone: z.string().trim().min(1).max(30).nullable().optional(),
    whatsappPhone: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{7,14}$/, 'Use international format, such as +919876543210')
      .nullable()
      .optional(),
    address: z.string().trim().max(5000).nullable().optional(),
    facebookUrl: z.url().max(500).nullable().optional(),
    instagramUrl: z.url().max(500).nullable().optional(),
    youtubeUrl: z.url().max(500).nullable().optional(),
  })
  .strict();

export type UpdateSiteSettingsDTO = z.infer<typeof updateSiteSettingsSchema>;
