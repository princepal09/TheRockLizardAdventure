import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { SiteSettings } from "@/types/site-settings";
import { normalizeSocialUrl } from "@/lib/social-url";

function webUrl(value: string | null) {
  if (!value) return null;
  const url = URL.parse(value);
  return url && (url.protocol === "https:" || url.protocol === "http:")
    ? url.href
    : null;
}

export async function getPublicSiteSettings(): Promise<SiteSettings | null> {
  "use cache";

  cacheLife("minutes");
  cacheTag("site-settings");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl}/site-settings`);
  if (!response.ok) throw new Error("Could not load public site settings");

  const { data }: ApiDataResponse<SiteSettings | null> = await response.json();
  if (!data) return null;

  return {
    ...data,
    heroImageUrl: webUrl(data.heroImageUrl),
    facebookUrl: normalizeSocialUrl(data.facebookUrl),
    instagramUrl: normalizeSocialUrl(data.instagramUrl),
    youtubeUrl: normalizeSocialUrl(data.youtubeUrl),
  };
}
