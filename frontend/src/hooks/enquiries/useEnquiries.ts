"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getEnquiries, getEnquiry, updateEnquiry } from "@/lib/api/enquiries";
import { enquiryKeys } from "@/lib/api/query-keys";
import { enquiryStatusSchema } from "@/lib/validation/admin";
import { useAuthStore } from "@/stores/auth.store";
import type { UpdateEnquiryInput } from "@/types/enquiry";

export function useEnquiries() {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: enquiryKeys.list(sessionVersion),
    queryFn: ({ signal }) => getEnquiries(signal),
  });
}

export function useEnquiry(id: string) {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  return useQuery({
    queryKey: enquiryKeys.detail(sessionVersion, id),
    queryFn: ({ signal }) => getEnquiry(id, signal),
  });
}

export function useUpdateEnquiry(id: string) {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();

  return useMutation({
    gcTime: 0,
    mutationFn: async (input: UpdateEnquiryInput) => updateEnquiry(id, enquiryStatusSchema.parse(input)),
    onSuccess: async (enquiry) => {
      const listKey = enquiryKeys.list(sessionVersion);
      const detailKey = enquiryKeys.detail(sessionVersion, id);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: detailKey }),
      ]);

      if (useAuthStore.getState().sessionVersion !== sessionVersion) return;

      queryClient.setQueryData(detailKey, enquiry);
      queryClient.setQueryData<typeof enquiry[]>(listKey, (items) =>
        items?.map((item) => item.id === id ? enquiry : item),
      );
      toast.success("Enquiry updated successfully");
    },
  });
}
