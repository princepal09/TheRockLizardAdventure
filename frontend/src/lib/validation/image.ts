import { z } from "zod";

export const imageFileSchema = z.file()
  .min(1, "Choose a non-empty image.")
  .max(5 * 1024 * 1024, "Choose an image up to 5 MB.")
  .refine(
    (file) => /^image\/(jpeg|jpg|png|webp|gif)$/.test(file.type) || /\.(jpe?g|png|webp|gif)$/i.test(file.name),
    "Choose a JPEG, PNG, WebP, or GIF image.",
  );

export const galleryFilesSchema = z.array(imageFileSchema)
  .min(1, "Choose at least one photo.")
  .max(5, "Choose up to 5 photos at a time.");

export const brandingFilesSchema = z.object({
  logo: imageFileSchema.optional(),
  heroImage: imageFileSchema.optional(),
}).refine(({ logo, heroImage }) => Boolean(logo || heroImage), {
  message: "Choose a logo or hero image to upload.",
});
