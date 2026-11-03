import { z } from "zod";

import { tripDifficulties, tripStatuses } from "@/types/trip";
import { imageFileSchema } from "./image";

const displayOrder = z.int32().nonnegative();
const distance = z.number().nonnegative().max(999999.99).multipleOf(0.01).nullable();
const price = z.number().nonnegative().max(99999999.99).multipleOf(0.01).nullable();
const optionalText = z.string().nullable();

export const tripFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(200),
  regionId: z.uuid("Select a region."),
  seasonIds: z.array(z.uuid()),
  difficulty: z.enum(tripDifficulties),
  status: z.enum(tripStatuses),
  durationDays: z.int32().positive("Enter a duration of at least one day."),
  summary: z.string().max(500).nullable(),
  description: optionalText,
  distanceKm: distance,
  maxAltitudeMeters: z.int32().nonnegative().nullable(),
  startingPoint: z.string().max(255).nullable(),
  endingPoint: z.string().max(255).nullable(),
  price,
  discountPrice: price,
  currency: z.string().regex(/^[A-Z]{3}$/, "Enter a three-letter currency code, such as INR."),
  maxGroupSize: z.int32().positive().nullable(),
  minAge: z.int32().nonnegative().nullable(),
  maxAge: z.int32().nonnegative().nullable(),
  isFeatured: z.boolean(),
  publishedAt: z.iso.datetime({ offset: true }).nullable(),
});

export const itineraryFormSchema = z.object({
  dayNumber: z.int32().positive("Enter a day number of at least 1."),
  title: z.string().trim().min(1, "Enter a title.").max(255),
  description: optionalText,
  distanceKm: distance,
  altitudeMeters: z.int32().nullable(),
});

const photoFields = {
  altText: z.string().max(255).nullable(),
  sortOrder: displayOrder,
};
export const tripPhotoFormSchema = z.object({ ...photoFields, caption: z.string().max(255).nullable() });
export const galleryPhotoFormSchema = z.object({ ...photoFields, isActive: z.boolean() });

const optionFields = {
  description: optionalText,
  isActive: z.boolean(),
};
const month = z.int().min(1).max(12).nullable();
export const tripOptionFormSchema = z.discriminatedUnion("kind", [
  z.object({
    ...optionFields,
    kind: z.literal("regions"),
    name: z.string().trim().min(1, "Enter a region name.").max(150),
    image: imageFileSchema.optional(),
  }),
  z.object({
    ...optionFields,
    kind: z.literal("seasons"),
    name: z.string().trim().min(1, "Enter a season name.").max(100),
    startMonth: month,
    endMonth: month,
  }),
]);

export const teamMemberFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(150),
  role: z.string().trim().min(1, "Enter a role.").max(100),
  bio: z.string().max(1500).nullable(),
  qualifications: z.string().max(500).nullable(),
  sortOrder: displayOrder,
  isActive: z.boolean(),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["READ", "UNREAD"]),
});

const socialUrl = z.url().max(500).nullable();
export const siteDetailsSchema = z.object({
  contactEmail: z.email("Enter a valid email address.").max(255).nullable(),
  contactPhone: z.string().trim().min(1).max(30).nullable(),
  whatsappPhone: z.string().regex(/^\+[1-9]\d{7,14}$/, "Use international format, such as +919876543210.").nullable(),
  address: z.string().max(5000).nullable(),
  facebookUrl: socialUrl,
  instagramUrl: socialUrl,
  youtubeUrl: socialUrl,
}).partial();
