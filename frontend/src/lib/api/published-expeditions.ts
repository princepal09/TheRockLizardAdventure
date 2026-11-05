import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { PublicListingTrip, Trip } from "@/types/trip";

export type PublishedExpedition = Pick<
  Trip,
  | "id"
  | "name"
  | "slug"
  | "coverImageUrl"
  | "startingPoint"
  | "endingPoint"
  | "durationDays"
  | "maxAltitudeMeters"
  | "difficulty"
  | "isFeatured"
  | "summary"
>;

async function readExpeditions<T>(path = ""): Promise<T | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Missing API base URL");
  const response = await fetch(`${base}/expeditions${path}`);
  if (path && response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load public expeditions");
  const { data }: ApiDataResponse<T> = await response.json();
  return data;
}

export async function getPublishedExpeditions() {
  "use cache";
  cacheLife("minutes");
  cacheTag("published-expeditions");
  return (await readExpeditions<PublicListingTrip[]>()) ?? [];
}

export async function getPublishedExpedition(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("published-expeditions");
  return readExpeditions<PublishedExpedition>(`/slug/${encodeURIComponent(slug)}`);
}
