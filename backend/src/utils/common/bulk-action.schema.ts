import z from 'zod';

export const bulkActionSchema = z
  .object({
    ids: z
      .array(z.uuid('Invalid record ID'))
      .min(1, 'Select at least one record')
      .max(5000)
      .transform((ids) => [...new Set(ids)]),
  })
  .strict();
