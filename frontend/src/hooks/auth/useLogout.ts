"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { logout, logoutAll } from "@/lib/api/auth";
import {
  authKeys,
  enquiryKeys,
  galleryKeys,
  siteSettingsKeys,
  teamKeys,
  tripKeys,
  tripOptionKeys,
} from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";

export function useEndAdminSession<Input>(
  endSession: (input: Input, accessToken: string) => Promise<unknown>,
  message: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    gcTime: 0,
    mutationFn: async (input: Input) => {
      const { accessToken, sessionVersion } = useAuthStore.getState();
      if (!accessToken) throw new Error("Your session has expired. Please sign in again.");
      await endSession(input, accessToken);
      return sessionVersion;
    },
    onSuccess: async (version) => {
      if (useAuthStore.getState().sessionVersion !== version) return;
      await queryClient.cancelQueries({ queryKey: authKeys.currentAdmin() });
      if (useAuthStore.getState().sessionVersion !== version) return;

      useAuthStore.getState().clearAuth();
      queryClient.setQueryData(authKeys.currentAdmin(), null);
      queryClient.removeQueries({ queryKey: enquiryKeys.all });
      queryClient.removeQueries({ queryKey: tripKeys.all });
      queryClient.removeQueries({ queryKey: tripOptionKeys.all });
      queryClient.removeQueries({ queryKey: galleryKeys.all });
      queryClient.removeQueries({ queryKey: siteSettingsKeys.all });
      queryClient.removeQueries({ queryKey: teamKeys.admin });
      toast.success(message);
    },
  });
}

export function useLogout(scope: "current" | "all" = "current") {
  return useEndAdminSession(
    (_input: void, token) => scope === "all" ? logoutAll(token) : logout(token),
    scope === "all" ? "Signed out on all devices" : "Signed out successfully",
  );
}
