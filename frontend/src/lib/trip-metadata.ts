import { notFound } from "next/navigation";
import { getPublishedTripDetail } from "./api/published-trip-detail";
import { pageMetadata } from "./page-metadata";
import type { TripKind } from "@/types/trip";

export async function tripMetadata(kind: TripKind, slug: string) {
  const trip = await getPublishedTripDetail(kind, slug);
  if (!trip) notFound();
  const description = (
    trip.summary?.trim() ||
    `${trip.durationDays}-day ${kind === "treks" ? "trek" : "expedition"}${trip.region?.name ? ` in ${trip.region.name}` : ""}. Explore the itinerary, preparation details and booking information with Rocklizard Adventure.`
  ).slice(0, 160);
  const image = trip.coverImageUrl || trip.images[0]?.imageUrl;
  return pageMetadata(
    trip.name,
    description,
    `/${kind}/${encodeURIComponent(trip.slug)}`,
    image || undefined,
  );
}
