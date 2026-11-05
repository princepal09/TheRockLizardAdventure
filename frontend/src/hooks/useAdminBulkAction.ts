"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSelectedRecords, type BulkActionScope } from "@/lib/api/bulk-actions";
import {
  dashboardKeys,
  enquiryKeys,
  teamKeys,
  tripKeys,
  tripOptionKeys,
} from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth.store";

export function useAdminBulkAction(
  scope: BulkActionScope,
  tripAction: "delete" | "publish" = "delete",
) {
  const version = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => updateSelectedRecords(scope, ids, tripAction),
    onSuccess: async ({ updatedCount, cleanupFailures }) => {
      if (useAuthStore.getState().sessionVersion !== version) return;
      const keys =
        scope === "team"
          ? [teamKeys.admin, teamKeys.public]
          : scope === "enquiries"
            ? [[...enquiryKeys.all, version], dashboardKeys.summary(version)]
            : [
                tripKeys.session(version),
                dashboardKeys.summary(version),
                [...enquiryKeys.all, version],
                tripOptionKeys.all,
              ];
      await Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
      if (useAuthStore.getState().sessionVersion !== version) return;
      const action =
        scope === "team"
          ? "hidden"
          : scope === "enquiries"
            ? "marked as read"
            : tripAction === "publish"
              ? "published"
              : "deleted";
      if (cleanupFailures) {
        toast.warning(
          `${updatedCount} selected trips deleted, but ${cleanupFailures} stored images could not be removed. Contact support to finish storage cleanup.`,
        );
        return;
      }
      toast.success(
        `${updatedCount} selected ${updatedCount === 1 ? "record" : "records"} ${action}`,
      );
    },
  });
}
