import z from 'zod';

const optionalText = z.string().trim().max(10000).nullable().optional();
export const tripPlanningFields = {
  departureDates: z
    .string()
    .trim()
    .max(2000)
    .refine(
      (value) =>
        !value ||
        value
          .split(/\r?\n/)
          .filter(Boolean)
          .every((date) => z.iso.date().safeParse(date.trim()).success),
      'Use one confirmed departure date per line in YYYY-MM-DD format',
    )
    .nullable()
    .optional(),
  meetingPoint: z.string().trim().max(1000).nullable().optional(),
  inclusions: optionalText,
  exclusions: optionalText,
  requiredGear: optionalText,
  cancellationPolicy: optionalText,
  refundPolicy: optionalText,
};

export type TripPlanningField = keyof typeof tripPlanningFields;
