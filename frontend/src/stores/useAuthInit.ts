"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getCurrentAdmin } from "@/lib/api/auth";
import { authKeys } from "@/lib/api/query-keys";
import { refreshAccessToken } from "@/lib/axios";
import { useAuthStore } from "./auth.store";

export function useAuthInit() {
  return useQuery({
    queryKey: authKeys.currentAdmin(),
    retry: false,
    queryFn: async () => {
      try {
        const token = useAuthStore.getState().accessToken ?? (await refreshAccessToken());
        return await getCurrentAdmin(token);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });
}
