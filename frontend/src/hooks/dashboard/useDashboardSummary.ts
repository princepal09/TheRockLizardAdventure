"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/lib/api/dashboard";
import { dashboardKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";

export function useDashboardSummary() {
  const version = useAuthStore((state) => state.sessionVersion);

  return useQuery({
    queryKey: dashboardKeys.summary(version),
    queryFn: ({ signal }) => getDashboardSummary(signal),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
