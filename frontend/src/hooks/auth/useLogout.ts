"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { logout } from "@/lib/api/auth";
import { authKeys, enquiryKeys, galleryKeys, siteSettingsKeys, tripKeys, tripOptionKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        await logout(token);
      }
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: authKeys.currentAdmin() });
      useAuthStore.getState().clearAuth();
      queryClient.setQueryData(authKeys.currentAdmin(), null);
      queryClient.removeQueries({ queryKey: enquiryKeys.all });
      queryClient.removeQueries({ queryKey: tripKeys.all });
      queryClient.removeQueries({ queryKey: tripOptionKeys.all });
      queryClient.removeQueries({ queryKey: galleryKeys.all });
      queryClient.removeQueries({ queryKey: siteSettingsKeys.all });
      toast.success("Signed out successfully");
    },
  });
}
