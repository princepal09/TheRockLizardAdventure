import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { TripDetail, TripKind } from "@/types/trip";
import type { Season } from "@/types/trip-option";

export type PublishedTripDetail = Omit<TripDetail, "seasons"> & {
  region?: { name: string };
  months?: { month: number }[];
  seasons: { seasonId: string; season: Season }[];
};

export async function getPublishedTripDetail(kind: TripKind, slug: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(`published-${kind}`, `${kind}:${slug}`);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Missing API base URL");

  const response = await fetch(`${base}/${kind}/slug/${encodeURIComponent(slug)}`);
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) throw new Error("Could not load published trip");

  const { data }: ApiDataResponse<PublishedTripDetail> = await response.json();
  return data;
}
