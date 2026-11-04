import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { Trip } from "@/types/trip";

export type TrekSearchItem = Pick<
  Trip,
  "id" | "name" | "slug" | "summary" | "coverImageUrl"
>;

export async function getPublishedTreks(): Promise<TrekSearchItem[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("published-treks");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!apiBase) throw new Error("Missing API base URL");

  const response = await fetch(`${apiBase}/treks`);
  if (!response.ok) throw new Error("Could not load published treks");

  const { data }: ApiDataResponse<TrekSearchItem[]> = await response.json();
  return data.map(({ id, name, slug, summary, coverImageUrl }) => ({
    id,
    name,
    slug,
    summary,
    coverImageUrl,
  }));
}
