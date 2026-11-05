import type { ApiDataResponse } from "@/types/api";
import type { DashboardSummary } from "@/types/dashboard";

import api from "../axios";

export async function getDashboardSummary(signal: AbortSignal) {
  const { data } = await api.get<ApiDataResponse<DashboardSummary>>("/dashboard/summary", {
    signal,
  });
  return data.data;
}
