"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/lib/api/auth";

import { useAuthStore } from "@/stores/auth.store";

import { authKeys } from "@/lib/api/query-keys";

import type { LoginFormValues } from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  const startSession = useAuthStore((state) => state.startSession);

  return useMutation({
    gcTime: 0,
    mutationFn: (input: LoginFormValues) => login(input),

    onSuccess: (result) => {
      // Store access token in Zustand
      startSession(result.accessToken);

      // Cache authenticated admin
      queryClient.setQueryData(authKeys.currentAdmin(), result.admin);
    },
  });
}
