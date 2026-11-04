import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { Season } from "@/types/trip-option";

export async function getPublicSeasons(): Promise<Season[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("public-seasons");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("Missing API base URL");

  const response = await fetch(`${baseUrl}/seasons`);
  if (!response.ok) throw new Error("Could not load public seasons");

  const { data }: ApiDataResponse<Season[]> = await response.json();
  return data.filter(({ isActive }) => isActive);
}
