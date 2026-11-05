"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useBulkSelection(eligibleIds: string[]) {
  const version = useAuthStore((state) => state.sessionVersion);
  const [selection, setSelection] = useState<{ version: number; ids: string[] }>({
    version,
    ids: [],
  });
  const eligible = new Set(eligibleIds);
  const selectedIds =
    selection.version === version ? selection.ids.filter((id) => eligible.has(id)) : [];
  const selected = new Set(selectedIds);

  return {
    selectedIds,
    isSelected: (id: string) => selected.has(id),
    clear: () => setSelection({ version, ids: [] }),
    selectAll: (checked: boolean) =>
      setSelection({ version, ids: checked ? [...eligibleIds] : [] }),
    toggle: (id: string) => {
      if (!eligible.has(id)) return;
      setSelection((previous) => {
        const current =
          previous.version === version ? previous.ids.filter((item) => eligible.has(item)) : [];
        return {
          version,
          ids: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        };
      });
    },
  };
}
