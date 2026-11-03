"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { siteSettingsKeys } from "@/lib/api/query-keys";
import { getSiteSettings, updateSiteSettings } from "@/lib/api/site-settings";
import { useAuthStore } from "@/stores/auth.store";

export function useSiteSettings() {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: siteSettingsKeys.detail(version),
    queryFn: ({ signal }) => getSiteSettings(signal),
  });
}

export function useSaveSiteSettings() {
  const version = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();
  const queryKey = siteSettingsKeys.detail(version);

  return useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: async (settings) => {
      await queryClient.cancelQueries({ queryKey });
      if (useAuthStore.getState().sessionVersion !== version) return;

      queryClient.setQueryData(queryKey, settings);
      toast.success("Site settings updated successfully");
    },
  });
}
