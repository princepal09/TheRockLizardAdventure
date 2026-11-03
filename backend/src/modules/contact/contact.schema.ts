import z from 'zod';
import { ContactStatus } from '../../../generated/prisma/client.js';

export const contactIdSchema = z.uuid('Invalid enquiry ID');

export const createContactSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    email: z.email().max(255),
    phone: z.string().trim().min(1).max(30).nullable().optional(),
    subject: z.string().trim().min(1).max(255).nullable().optional(),
    message: z.string().trim().min(1).max(5000),
    trekId: z.uuid().nullable().optional(),
    expeditionId: z.uuid().nullable().optional(),
  })
  .strict()
  .refine((data) => !data.trekId || !data.expeditionId, 'Select either a trek or an expedition');

export const updateContactSchema = z
  .object({
    status: z.enum(ContactStatus).optional(),
    adminNotes: z.string().trim().max(5000).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'Provide at least one field to update');

export type CreateContactDTO = z.infer<typeof createContactSchema>;
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
