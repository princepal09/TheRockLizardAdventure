import type { ApiDataResponse } from "@/types/api";
import type { SiteSettings, SiteSettingsUpdate } from "@/types/site-settings";

import api, { publicApi } from "../axios";

export async function getSiteSettings(signal: AbortSignal) {
  const { data } = await publicApi.get<ApiDataResponse<SiteSettings | null>>("/site-settings", {
    signal,
  });
  return data.data;
}

export async function updateSiteSettings(input: SiteSettingsUpdate) {
  const { data } = await api.patch<ApiDataResponse<SiteSettings>>("/site-settings", input);
  return data.data;
}
