import { tripPlanningFields } from '../trip-planning/trip-planning.schema.js';
import { richDescriptionSchema } from '../trip-planning/rich-description.schema.js';
import z from 'zod';
import { ContentStatus, DifficultyLevel, TripType } from '../../../generated/prisma/client.js';
import { seasonIdsSchema } from '../season/season.schema.js';

const numberInput = z.union([
  z.number(),
  z
    .string()
    .trim()
    .regex(/^-?\d+(?:\.\d+)?$/)
    .transform(Number),
]);

export const tripIdSchema = z.uuid('Invalid trip ID');
export const tripSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(220)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const createTripSchema = z
  .object({
    ...tripPlanningFields,
    tripType: z.enum(TripType),
    vehicleDetails: z.string().trim().max(5000).nullable().optional(),
    name: z.string().trim().min(1).max(200),
    summary: z.string().max(500).nullable().optional(),
    description: z.string().nullable().optional(),
    descriptionRich: richDescriptionSchema,
    regionId: z.uuid('Invalid region ID'),
    seasonIds: seasonIdsSchema.optional(),
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

export const updateTripSchema = createTripSchema.partial();

export type CreateTripDTO = z.infer<typeof createTripSchema>;
export type UpdateTripDTO = z.infer<typeof updateTripSchema>;
