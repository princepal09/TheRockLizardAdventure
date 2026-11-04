import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { GalleryImage } from "@/types/gallery";

export async function getPublicGallery(): Promise<
  Pick<GalleryImage, "id" | "imageUrl" | "altText">[]
> {
  "use cache";

  cacheLife("minutes");
  cacheTag("public-gallery");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("Missing API base URL");

  const response = await fetch(`${baseUrl}/gallery`);
  if (!response.ok) throw new Error("Could not load the public gallery");

  const { data }: ApiDataResponse<GalleryImage[]> = await response.json();
  return data.map(({ id, imageUrl, altText }) => ({ id, imageUrl, altText }));
}
