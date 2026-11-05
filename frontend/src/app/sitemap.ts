import type { MetadataRoute } from "next";
import { getPublishedTreks } from "@/lib/api/published-treks";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treks, expeditions] = await Promise.all([
    getPublishedTreks(),
    getPublishedExpeditions(),
  ]);
  return [
    ...[
      "",
      "/about",
      "/treks",
      "/expeditions",
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
    ...expeditions.map(({ slug }) => ({
      url: `${siteUrl}/expeditions/${encodeURIComponent(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
