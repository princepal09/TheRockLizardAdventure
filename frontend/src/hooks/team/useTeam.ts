"use client";

import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { teamKeys } from "@/lib/api/query-keys";
import { getPublicTeam, getTeamMember, getTeamMembers } from "@/lib/api/team";
import { useAuthStore } from "@/stores/auth.store";

export function usePublicTeam() {
  return useQuery({
    queryKey: teamKeys.public,
    queryFn: ({ signal }) => getPublicTeam(signal),
  });
}

export function useTeamMembers() {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: teamKeys.list(version),
    queryFn: ({ signal }) => getTeamMembers(signal),
  });
}

export function useTeamMember(id?: string) {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: teamKeys.detail(version, id),
    queryFn: id ? ({ signal }) => getTeamMember(id, signal) : skipToken,
  });
}

export function useTeamMutation<Input>(
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
        queryClient.invalidateQueries({ queryKey: teamKeys.list(version) }),
        queryClient.invalidateQueries({ queryKey: teamKeys.public }),
        id &&
          queryClient.invalidateQueries({
            queryKey: teamKeys.detail(version, id),
            refetchType: "none",
          }),
      ]);
      if (useAuthStore.getState().sessionVersion === version) toast.success(message);
    },
  });
}
