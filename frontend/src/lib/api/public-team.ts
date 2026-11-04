import { cacheLife, cacheTag } from "next/cache";

import type { ApiDataResponse } from "@/types/api";
import type { TeamMember } from "@/types/team";

export async function getCachedPublicTeam(): Promise<TeamMember[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("public-team");

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Missing API base URL");

  const response = await fetch(`${base}/team`);
  if (!response.ok) throw new Error("Could not load the public team");

  const { data }: ApiDataResponse<TeamMember[]> = await response.json();
  return data;
}
