"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Trash2, type LucideIcon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/error";

type ConfirmationProps = {
  label: ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  onConfirm: () => Promise<unknown>;
};

export function DangerConfirmation({
  label,
  title,
  description,
  disabled,
  onConfirm,
  confirmLabel,
  pendingLabel,
  icon: Icon,
  filledTrigger,
  triggerClassName,
}: ConfirmationProps & {
  confirmLabel: string;
  pendingLabel: string;
  icon: LucideIcon;
  filledTrigger?: boolean;
  triggerClassName?: string;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function confirmAction() {
    if (pending) return;
    setError("");
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen, event) => {
        if (pending) {
          event.cancel();
          return;
        }
        if (nextOpen) setError("");
        setOpen(nextOpen);
      }}
    >
      <AlertDialog.Trigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="destructive"
            className={`${filledTrigger ? "bg-red-700 text-white hover:bg-red-800" : ""} ${triggerClassName ?? ""}`}
          />
        }
      >
        {label}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-60 bg-primary/65" />
        <AlertDialog.Popup
          initialFocus={cancelRef}
          className="fixed top-1/2 left-1/2 z-60 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-primary shadow-2xl sm:p-6"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-red-100 text-red-700">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <AlertDialog.Title className="mt-4 text-lg font-semibold break-words">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 break-words text-slate-600">
            {description}
          </AlertDialog.Description>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm break-words text-red-800"
            >
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <AlertDialog.Close
              ref={cancelRef}
              disabled={pending}
              render={<Button type="button" variant="outline" className="min-h-11 px-4" />}
            >
              Cancel
            </AlertDialog.Close>
            <Button
              type="button"
              disabled={pending}
              onClick={() => void confirmAction()}
              className="min-h-11 bg-red-700 px-4 text-white hover:bg-red-800"
            >
              {pending ? pendingLabel : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default function DeleteConfirmation(props: ConfirmationProps) {
  return (
    <DangerConfirmation {...props} confirmLabel="Delete" pendingLabel="Deleting…" icon={Trash2} />
  );
}
