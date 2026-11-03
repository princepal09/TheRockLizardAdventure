"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { ImageUp, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ComponentProps, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTripOption, useTripOptionMutation, useTripOptions } from "@/hooks/trip-options/useTripOptions";
import { deleteTripOption, saveTripOption } from "@/lib/api/trip-options";
import { tripOptionFormSchema } from "@/lib/validation/admin";
import type { Region, Season, TripOptionInput, TripOptionKind } from "@/types/trip-option";
import { getErrorMessage } from "@/utils/error";
import DeleteConfirmation from "./DeleteConfirmation";

const inputClass = "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";
const panelClass = "rounded-xl border border-slate-200 bg-white shadow-sm";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function RequiredMark() {
  return <span aria-hidden="true" className="ml-1 text-orange-700">*</span>;
}

function MonthField({ label, ...props }: ComponentProps<"select"> & { label: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      <select {...props} className={inputClass}>
        <option value="">Select a month</option>
        {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
      </select>
    </label>
  );
}

function OptionForm({ kind, item, onClose }: {
  kind: TripOptionKind;
  item?: Region | Season;
  onClose: () => void;
}) {
  const isRegion = kind === "regions";
  const label = isRegion ? "Region" : "Season";
  const region = item && "imageUrl" in item ? item : undefined;
  const season = item && "startMonth" in item ? item : undefined;
  const save = useTripOptionMutation(kind, async (input: TripOptionInput) => saveTripOption(item?.id, tripOptionFormSchema.parse(input)), item ? `${label} updated` : `${label} created`, item?.id);
  const remove = useTripOptionMutation(kind, (id: string) => deleteTripOption(kind, id), `${label} deleted`, item?.id);
  const busy = save.isPending || remove.isPending;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const fields = {
      name: text("name"),
      description: text("description") || null,
      isActive: form.has("isActive"),
    };
    const image = form.get("image");
    const input: TripOptionInput = isRegion
      ? { ...fields, kind, image: image instanceof File && image.name ? image : undefined }
      : { ...fields, kind, startMonth: Number(text("startMonth")) || null, endMonth: Number(text("endMonth")) || null };
    save.mutate(input, { onSuccess: onClose });
  }

  return (
    <form noValidate onSubmit={submit} className={`${panelClass} space-y-4 p-5 sm:p-6`}>
      <header className="border-b border-slate-200 pb-4">
        <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-24 text-lg font-semibold text-primary">{item ? `Edit ${label.toLowerCase()}` : `New ${label.toLowerCase()}`}</h2>
        <p className="mt-1 text-xs text-slate-600"><RequiredMark /> Required field</p>
      </header>

      <fieldset disabled={busy} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Name<RequiredMark /></span>
          <input className={inputClass} name="name" maxLength={isRegion ? 150 : 100} defaultValue={item?.name} required />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Description</span>
          <textarea className={inputClass} name="description" rows={3} defaultValue={item?.description ?? ""} />
        </label>
        {isRegion ? (
          <div className="space-y-3">
            {region?.imageUrl && (
              <Image src={region.imageUrl} alt="Current region image" width={240} height={160} unoptimized className="aspect-video w-40 rounded-lg object-cover" />
            )}
            <label className="flex min-w-0 items-start gap-3 rounded-xl border border-dashed border-sky-300 bg-tertiary/5 p-3">
              <ImageUp aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="block text-sm font-semibold">{region?.imageUrl ? "Replace image" : "Region image"}</span>
                <span className="block text-xs text-slate-600">JPEG, PNG, WebP, or GIF · Up to 5 MB</span>
                <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" className="block w-full text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground focus-visible:outline-2 focus-visible:outline-tertiary" />
              </span>
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <MonthField label="Start month" name="startMonth" defaultValue={season?.startMonth ?? ""} />
            <MonthField label="End month" name="endMonth" defaultValue={season?.endMonth ?? ""} />
          </div>
        )}
        <label className="flex min-h-9 items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isActive" defaultChecked={item?.isActive ?? true} />
          Active
        </label>
      </fieldset>

      {save.error && (
        <p role="alert" className="text-sm text-red-800">{getErrorMessage(save.error)}</p>
      )}
      <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
        <Button type="submit" variant="secondary" disabled={busy}>{save.isPending ? "Saving…" : item ? "Save changes" : `Create ${label.toLowerCase()}`}</Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button>
        {item && (
          <DeleteConfirmation
            label="Delete"
            title={`Delete ${label.toLowerCase()}?`}
            description={`“${item.name}” will be permanently deleted.`}
            disabled={busy}
            onConfirm={async () => {
              await remove.mutateAsync(item.id);
              onClose();
            }}
          />
        )}
      </div>
    </form>
  );
}

export default function TripOptionsPage({ kind }: { kind: TripOptionKind }) {
  const [editor, setEditor] = useState<string>();
  const list = useTripOptions(kind);
  const detail = useTripOption(kind, editor === "new" ? undefined : editor);
  const isRegion = kind === "regions";
  const title = isRegion ? "Regions" : "Seasons";
  const closeEditor = () => setEditor((current) => current === editor ? undefined : current);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Website</p>
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-slate-600">{isRegion ? "Manage destinations and their images." : "Manage the seasons available to trip editors."}</p>
        </div>
        <Button type="button" variant="secondary" size="lg" onClick={() => setEditor("new")}>
          <Plus aria-hidden="true" />
          {isRegion ? "New region" : "New season"}
        </Button>
      </header>

      <div className={editor ? "grid items-start gap-5 lg:grid-cols-2" : undefined}>
        {editor && (
          <div className="min-w-0 lg:order-last">
            {editor === "new" || detail.data ? (
              <OptionForm key={editor} kind={kind} item={editor === "new" ? undefined : detail.data} onClose={closeEditor} />
            ) : detail.isError ? (
              <div className={`${panelClass} space-y-3 p-5`}>
                <p role="alert" className="text-sm text-red-800">{getErrorMessage(detail.error)}</p>
                <Button type="button" variant="outline" onClick={() => void detail.refetch()} disabled={detail.isFetching}>Retry</Button>
              </div>
            ) : <ModuleSkeleton label="Loading details" variant="form" />}
          </div>
        )}
        <div className={panelClass}>
          {list.isPending ? (
            <ModuleSkeleton label={`Loading ${kind}`} />
          ) : list.isError ? (
            <div className="space-y-3 p-5">
              <p role="alert" className="text-sm text-red-800">{getErrorMessage(list.error)}</p>
              <Button type="button" variant="outline" onClick={() => void list.refetch()} disabled={list.isFetching}>Retry</Button>
            </div>
          ) : list.data.length ? (
            <ul className="divide-y divide-slate-200">
              {list.data.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={editor === item.id}
                    onClick={() => setEditor(item.id)}
                    className="flex min-h-14 w-full flex-wrap items-center justify-between gap-2 rounded-lg px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary aria-pressed:bg-tertiary/10 sm:px-5"
                  >
                    <span className="min-w-0 font-semibold break-words text-primary">{item.name}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.isActive ? "bg-tertiary/20 text-tertiary-foreground" : "bg-slate-100 text-slate-700"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-slate-600">No {kind} yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
