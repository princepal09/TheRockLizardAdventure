import z from 'zod';

const socialUrl = z
  .string()
  .trim()
  .transform((value) => (/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`))
  .pipe(
    z
      .url()
      .max(500)
      .refine((value) => {
        const url = new URL(value);
        return (
          ['http:', 'https:'].includes(url.protocol) &&
          !url.username &&
          !url.password &&
          url.hostname.includes('.')
        );
      }, 'Enter a valid http:// or https:// profile link.'),
  )
  .nullable()
  .optional();

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
    facebookUrl: socialUrl,
    instagramUrl: socialUrl,
    youtubeUrl: socialUrl,
  })
  .strict();

export type UpdateSiteSettingsDTO = z.infer<typeof updateSiteSettingsSchema>;
