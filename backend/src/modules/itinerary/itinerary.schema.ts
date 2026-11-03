import z from 'zod';

export const itineraryIdSchema = z.uuid('Invalid itinerary ID');

export const createItinerarySchema = z
  .object({
    dayNumber: z.int32().positive(),
    title: z.string().trim().min(1).max(255),
    description: z.string().nullable().optional(),
    distanceKm: z.number().nonnegative().max(999999.99).multipleOf(0.01).nullable().optional(),
    altitudeMeters: z.int32().nullable().optional(),
  })
  .strict();

export const updateItinerarySchema = createItinerarySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update');

export type CreateItineraryDTO = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryDTO = z.infer<typeof updateItinerarySchema>;
