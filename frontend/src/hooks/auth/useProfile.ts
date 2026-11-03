"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { changePassword, updateProfile } from "@/lib/api/auth";
import { authKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";
import type { UpdateProfileInput } from "@/types/auth";
import { useEndAdminSession } from "./useLogout";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const queryKey = authKeys.currentAdmin();

  return useMutation({
    gcTime: 0,
    mutationFn: async (input: UpdateProfileInput) => {
      const { accessToken, sessionVersion } = useAuthStore.getState();
      if (!accessToken) throw new Error("Your session has expired. Please sign in again.");
      const admin = await updateProfile(input, accessToken);
      return { admin, sessionVersion };
    },
    onSuccess: async ({ admin, sessionVersion }) => {
      if (useAuthStore.getState().sessionVersion !== sessionVersion) return;
      await queryClient.cancelQueries({ queryKey });
      if (useAuthStore.getState().sessionVersion !== sessionVersion) return;

      queryClient.setQueryData(queryKey, admin);
      toast.success("Profile updated successfully");
    },
  });
}

export function useChangePassword() {
  return useEndAdminSession(changePassword, "Password changed successfully. Please sign in again.");
}
