import { z } from "zod";

import type { CreateEnquiryInput } from "@/types/enquiry";

export const contactSchema = z
  .object({
    category: z.enum(["general", "trip"]),
    trip: z.string(),
    name: z.string().trim().min(1, "Enter your full name.").max(150),
    email: z
      .string()
      .trim()
      .pipe(z.email("Enter a valid email address.").max(255)),
    phone: z.string().trim().max(30, "Use at most 30 characters."),
    subject: z.string().trim().min(1, "Select an enquiry topic.").max(255),
    message: z
      .string()
      .trim()
      .min(1, "Enter a message.")
      .max(5000, "Use at most 5,000 characters."),
  })
  .superRefine((values, ctx) => {
    if (values.category === "trip") {
      const [kind, id, extra] = values.trip.split(":");
      if (
        (kind !== "treks" && kind !== "expeditions") ||
        extra !== undefined ||
        !z.uuid().safeParse(id).success
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["trip"],
          message: "Select a trek or expedition.",
        });
      }
    }

    const bytes = new TextEncoder().encode(
      JSON.stringify(toEnquiryInput(values)),
    ).byteLength;
    if (bytes > 10 * 1024) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Shorten your message and try again.",
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactSchema>;

export function toEnquiryInput({
  category,
  trip,
  name,
  email,
  phone,
  subject,
  message,
}: ContactFormValues): CreateEnquiryInput {
  const input = { name, email, phone: phone || undefined, subject, message };
  if (category === "general") return input;
  const [kind, id] = trip.split(":");
  return kind === "treks"
    ? { ...input, trekId: id }
    : { ...input, expeditionId: id };
}
