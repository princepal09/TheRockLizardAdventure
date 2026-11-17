import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { PublicListingTrip } from "@/types/trip";

export type TrekSearchItem = Pick<
  PublicListingTrip,
  | "id"
  | "name"
  | "slug"
  | "summary"
  | "coverImageUrl"
  | "isFeatured"
  | "difficulty"
  | "durationDays"
  | "region"
>;

export async function getPublishedTreks(): Promise<PublicListingTrip[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("published-treks");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!apiBase) throw new Error("Missing API base URL");

  const response = await fetch(`${apiBase}/treks`);
  if (!response.ok) throw new Error("Could not load published treks");

  const { data }: ApiDataResponse<PublicListingTrip[]> = await response.json();
  return data.map(
    ({
      id,
      name,
      slug,
      summary,
      coverImageUrl,
      isFeatured,
      difficulty,
      durationDays,
      maxAltitudeMeters,
      regionId,
      region,
      seasons,
      startingPoint,
      endingPoint,
      price,
      discountPrice,
      currency,
    }) => ({
      id,
      name,
      slug,
      summary,
      coverImageUrl,
      isFeatured,
      difficulty,
      durationDays,
      maxAltitudeMeters,
      regionId,
      region,
      seasons,
      startingPoint,
      endingPoint,
      price,
      discountPrice,
      currency,
    }),
  );
}
