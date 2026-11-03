"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getGalleryImages } from "@/lib/api/gallery";
import { galleryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";

export function useGallery() {
  const version = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: galleryKeys.list(version),
    queryFn: ({ signal }) => getGalleryImages(signal),
  });
}

export function useGalleryMutation<Input>(
  mutationFn: (input: Input) => Promise<void>,
  message: string,
) {
  const version = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      if (useAuthStore.getState().sessionVersion !== version) return;
      await queryClient.invalidateQueries({ queryKey: galleryKeys.list(version) });
      if (useAuthStore.getState().sessionVersion === version) toast.success(message);
    },
  });
}
