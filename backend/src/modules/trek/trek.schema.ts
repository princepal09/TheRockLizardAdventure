import z from 'zod';
import { ContentStatus, DifficultyLevel } from '../../../generated/prisma/client.js';

const numberInput = z.union([
  z.number(),
  z
    .string()
    .trim()
    .regex(/^-?\d+(?:\.\d+)?$/)
    .transform(Number),
]);

export const trekIdSchema = z.uuid('Invalid trek ID');
export const trekSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(220)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const createTrekSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: trekSlugSchema,
    summary: z.string().max(500).nullable().optional(),
    description: z.string().nullable().optional(),
    regionId: z.uuid('Invalid region ID'),
    difficulty: z.enum(DifficultyLevel),
    status: z.enum(ContentStatus).optional(),
    durationDays: numberInput.pipe(z.int32().positive()),
    distanceKm: numberInput
      .pipe(z.number().nonnegative().max(999999.99).multipleOf(0.01))
      .nullable()
      .optional(),
    maxAltitudeMeters: numberInput.pipe(z.int32().nonnegative()).nullable().optional(),
    startingPoint: z.string().max(255).nullable().optional(),
    endingPoint: z.string().max(255).nullable().optional(),
    coverImageUrl: z.url().max(1000).nullable().optional(),
    price: numberInput
      .pipe(z.number().nonnegative().max(99999999.99).multipleOf(0.01))
      .nullable()
      .optional(),
    discountPrice: numberInput
      .pipe(z.number().nonnegative().max(99999999.99).multipleOf(0.01))
      .nullable()
      .optional(),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .optional(),
    maxGroupSize: numberInput.pipe(z.int32().positive()).nullable().optional(),
    minAge: numberInput.pipe(z.int32().nonnegative()).nullable().optional(),
    maxAge: numberInput.pipe(z.int32().nonnegative()).nullable().optional(),
    isFeatured: z
      .union([z.boolean(), z.stringbool({ truthy: ['true'], falsy: ['false'] })])
      .optional(),
    publishedAt: z.iso
      .datetime({ offset: true })
      .transform((value) => new Date(value))
      .nullable()
      .optional(),
  })
  .strict();

export const updateTrekSchema = createTrekSchema.partial();

export type CreateTrekDTO = z.infer<typeof createTrekSchema>;
export type UpdateTrekDTO = z.infer<typeof updateTrekSchema>;
