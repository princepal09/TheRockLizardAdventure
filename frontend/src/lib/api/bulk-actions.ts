import type { ApiDataResponse } from "@/types/api";
import api from "../axios";

export const bulkActionPaths = {
  treks: "/treks/bulk",
  expeditions: "/expeditions/bulk",
  enquiries: "/enquiries/bulk/read",
  team: "/team/bulk/hide",
} as const;

export type BulkActionScope = keyof typeof bulkActionPaths;

export async function updateSelectedRecords(
  scope: BulkActionScope,
  ids: string[],
  action: "delete" | "publish" = "delete",
) {
  if (!ids.length || ids.length > 5000) throw new Error("Select between 1 and 5,000 records.");
  if (scope === "treks" || scope === "expeditions") {
    if (action === "publish") {
      const { data } = await api.patch<ApiDataResponse<{ updatedCount: number }>>(
        `${bulkActionPaths[scope]}/publish`,
        { ids },
      );
      return { updatedCount: data.data.updatedCount, cleanupFailures: 0 };
    }
    const { data } = await api.delete<
      ApiDataResponse<{ deletedCount: number; cleanupFailures: number }>
    >(bulkActionPaths[scope], { data: { ids } });
    return { updatedCount: data.data.deletedCount, cleanupFailures: data.data.cleanupFailures };
  }
  const { data } = await api.patch<ApiDataResponse<{ updatedCount: number }>>(
    bulkActionPaths[scope],
    { ids },
  );
  return { updatedCount: data.data.updatedCount, cleanupFailures: 0 };
}
