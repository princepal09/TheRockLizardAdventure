import type { MetadataRoute } from "next";
import { getPublishedTreks } from "@/lib/api/published-treks";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";
import { getPublishedRoadTrips } from "@/lib/api/published-road-trips";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treks, expeditions, trips] = await Promise.all([
    getPublishedTreks(),
    getPublishedExpeditions(),
    getPublishedRoadTrips(),
  ]);
  return [
    ...[
      "",
      "/about",
      "/treks",
      "/expeditions",
      "/trips",
      "/gallery",
      "/travel-trade",
      "/contact",
    ].map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path ? 0.7 : 1,
    })),
    ...treks.map(({ slug }) => ({
      url: `${siteUrl}/treks/${encodeURIComponent(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...trips.map(({ slug }) => ({
      url: `${siteUrl}/trips/${encodeURIComponent(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...expeditions.map(({ slug }) => ({
      url: `${siteUrl}/expeditions/${encodeURIComponent(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
