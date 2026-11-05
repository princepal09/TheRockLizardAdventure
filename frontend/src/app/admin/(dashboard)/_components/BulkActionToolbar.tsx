"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/error";

export function SelectionCheckbox({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="grid min-h-11 min-w-11 shrink-0 cursor-pointer place-items-center">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="size-4 cursor-pointer accent-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 disabled:cursor-not-allowed"
      />
    </label>
  );
}

export default function BulkActionToolbar({
  selectedCount,
  eligibleCount,
  pending,
  actionLabel,
  destructive = false,
  selectionLabel = "Select all eligible",
  confirmation,
  additionalAction,
  onSelectAll,
  onClear,
  onExecute,
}: {
  selectedCount: number;
  eligibleCount: number;
  pending: boolean;
  actionLabel: string;
  destructive?: boolean;
  selectionLabel?: string;
  confirmation?: string;
  additionalAction?: {
    label: string;
    count: number;
    confirmation: string;
    onExecute: () => Promise<unknown>;
  };
  onSelectAll: (checked: boolean) => void;
  onClear: () => void;
  onExecute: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [useAdditionalAction, setUseAdditionalAction] = useState(false);
  const [error, setError] = useState("");
  const [executing, setExecuting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const busy = pending || executing;
  const activeAction =
    useAdditionalAction && additionalAction
      ? { ...additionalAction, destructive: false }
      : { label: actionLabel, count: selectedCount, confirmation, onExecute, destructive };
  async function execute() {
    if (busy || !activeAction.count) return;
    setError("");
    setExecuting(true);
    try {
      await activeAction.onExecute();
      onClear();
      setOpen(false);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setExecuting(false);
    }
  }
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary">
          <input
            type="checkbox"
            checked={eligibleCount > 0 && selectedCount === eligibleCount}
            ref={(node) => {
              if (node) node.indeterminate = selectedCount > 0 && selectedCount < eligibleCount;
            }}
            disabled={busy || !eligibleCount}
            onChange={(event) => onSelectAll(event.target.checked)}
            className="size-4 accent-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
          />
          {selectionLabel}
        </label>
        <span role="status" className="text-xs text-slate-600">
          {selectedCount} selected · {eligibleCount} eligible
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy || !selectedCount}
            onClick={onClear}
          >
            Clear selection
          </Button>
          {additionalAction && (
            <Button
              type="button"
              variant="secondary"
              className="text-white"
              disabled={busy || !additionalAction.count}
              onClick={() => {
                setError("");
                setUseAdditionalAction(true);
                setOpen(true);
              }}
            >
              {busy && useAdditionalAction ? "Publishing…" : additionalAction.label}
              {` (${additionalAction.count})`}
            </Button>
          )}
          <Button
            type="button"
            variant={destructive ? "destructive" : "secondary"}
            className={destructive ? "bg-red-700 text-white hover:bg-red-800" : undefined}
            disabled={busy || !selectedCount}
            onClick={() => {
              setError("");
              setUseAdditionalAction(false);
              if (confirmation) setOpen(true);
              else void execute();
            }}
          >
            {busy && !useAdditionalAction ? (destructive ? "Deleting…" : "Updating…") : actionLabel}
          </Button>
        </div>
      </div>
      {!open && error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
      {(confirmation || additionalAction) && (
        <AlertDialog.Root
          open={open}
          onOpenChange={(nextOpen, event) => {
            if (busy) {
              event.cancel();
              return;
            }
            setOpen(nextOpen);
          }}
        >
          <AlertDialog.Portal>
            <AlertDialog.Backdrop className="fixed inset-0 z-60 bg-primary/65" />
            <AlertDialog.Popup
              initialFocus={cancelRef}
              className="fixed top-1/2 left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 text-primary shadow-2xl sm:p-6"
            >
              <AlertDialog.Title className="text-lg font-semibold">
                {activeAction.label} ({activeAction.count})?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 text-sm leading-relaxed text-slate-600">
                {activeAction.confirmation}
              </AlertDialog.Description>
              {error && (
                <p role="alert" className="mt-3 text-sm text-red-800">
                  {error}
                </p>
              )}
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <AlertDialog.Close
                  ref={cancelRef}
                  disabled={busy}
                  render={<Button type="button" variant="outline" />}
                >
                  Cancel
                </AlertDialog.Close>
                <Button
                  type="button"
                  variant={activeAction.destructive ? "destructive" : "secondary"}
                  className={
                    activeAction.destructive
                      ? "bg-red-700 text-white hover:bg-red-800"
                      : "text-white"
                  }
                  disabled={busy || !activeAction.count}
                  onClick={() => void execute()}
                >
                  {busy
                    ? activeAction.destructive
                      ? "Deleting…"
                      : "Updating…"
                    : activeAction.label}
                </Button>
              </div>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </div>
  );
}
