import { cacheLife, cacheTag } from "next/cache";
import type { ApiDataResponse } from "@/types/api";
import type { PublicListingTrip } from "@/types/trip";

export async function getPublishedRoadTrips(): Promise<PublicListingTrip[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("published-trips");
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Missing API base URL");
  const response = await fetch(base + "/trips");
  if (!response.ok) throw new Error("Could not load public trips");
  const { data }: ApiDataResponse<PublicListingTrip[]> = await response.json();
  return data;
}
