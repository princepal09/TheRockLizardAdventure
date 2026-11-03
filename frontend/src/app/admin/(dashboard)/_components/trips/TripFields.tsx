import type { ComponentProps } from "react";

import { RequiredMark } from "../ImageUploadField";

export const tripPanelClass =
  "space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
export const tripGridClass = "grid gap-x-5 gap-y-4 sm:grid-cols-2";
export const tripInputClass =
  "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-primary transition-colors hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-tertiary";

export function TripField({
  label,
  required,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>
        {label}
        {required && <RequiredMark />}
      </span>
      <input className={tripInputClass} required={required} {...props} />
    </label>
  );
}

export function tripText(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

export function tripNumber(form: FormData, name: string) {
  const value = tripText(form, name);
  return value ? Number(value) : null;
}
