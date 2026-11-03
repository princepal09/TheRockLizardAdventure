"use client";

import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { tripKeys, tripOptionKeys } from "@/lib/api/query-keys";
import { getTripOption, getTripOptions } from "@/lib/api/trip-options";
import { useAuthStore } from "@/stores/auth.store";
import type { TripOptionKind } from "@/types/trip-option";
import { getErrorMessage } from "@/utils/error";

export function useTripOptions(kind: TripOptionKind) {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: tripOptionKeys.list(version, kind),
    queryFn: ({ signal }) => getTripOptions(kind, signal),
  });
}

export function useTripOption(kind: TripOptionKind, id?: string) {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: tripOptionKeys.detail(version, kind, id),
    queryFn: id ? ({ signal }) => getTripOption(kind, id, signal) : skipToken,
  });
}

export function useTripOptionMutation<Input>(
  kind: TripOptionKind,
  mutationFn: (input: Input) => Promise<void>,
  message: string,
  id?: string,
) {
  const version = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      if (useAuthStore.getState().sessionVersion !== version) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tripOptionKeys.list(version, kind) }),
        queryClient.invalidateQueries({ queryKey: tripKeys.options(version) }),
        id && queryClient.invalidateQueries({
          queryKey: tripOptionKeys.detail(version, kind, id),
          refetchType: "none",
        }),
      ]);
      if (useAuthStore.getState().sessionVersion === version) toast.success(message);
    },
    onError: (error) => {
      if (useAuthStore.getState().sessionVersion === version) toast.error(getErrorMessage(error));
    },
  });
}
