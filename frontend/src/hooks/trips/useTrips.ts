"use client";

import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { tripKeys } from "@/lib/api/query-keys";
import { getTrip, getTripEditorOptions, getTrips } from "@/lib/api/trips";
import { useAuthStore } from "@/stores/auth.store";
import type { TripKind } from "@/types/trip";

export function useTrips(kind: TripKind) {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: tripKeys.list(version, kind),
    queryFn: ({ signal }) => getTrips(kind, signal),
  });
}

export function useTrip(kind: TripKind, id?: string) {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: tripKeys.detail(version, kind, id),
    queryFn: id ? ({ signal }) => getTrip(kind, id, signal) : skipToken,
  });
}

export function useTripOptions() {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: tripKeys.options(version),
    queryFn: ({ signal }) => getTripEditorOptions(signal),
  });
}

export function useTripMutation<Input, Result>(
  kind: TripKind,
  mutationFn: (input: Input) => Promise<Result>,
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
        queryClient.invalidateQueries({ queryKey: tripKeys.list(version, kind) }),
        id &&
          queryClient.invalidateQueries({
            queryKey: tripKeys.detail(version, kind, id),
          }),
      ]);
      if (useAuthStore.getState().sessionVersion === version)
        toast.success(message);
    },
  });
}
