"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import Image from "next/image";
import type { FormEvent } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteAllGallery, useGallery, useGalleryMutation } from "@/hooks/gallery/useGallery";
import { galleryKeys } from "@/lib/api/query-keys";
import { deleteGalleryImage, updateGalleryImage, uploadGalleryImages } from "@/lib/api/gallery";
import type { GalleryImage, GalleryImageInput } from "@/types/gallery";
import { galleryPhotoFormSchema } from "@/lib/validation/admin";
import { getErrorMessage } from "@/utils/error";
import GalleryUploadForm from "../../_components/GalleryUploadForm";
import DeleteConfirmation, { DangerConfirmation } from "../../_components/DeleteConfirmation";
import { RequiredMark } from "../../_components/ImageUploadField";

const inputClass =
  "block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-tertiary";

function GalleryCard({ image }: { image: GalleryImage }) {
  const save = useGalleryMutation(
    async (input: GalleryImageInput) =>
      updateGalleryImage(image.id, galleryPhotoFormSchema.parse(input)),
    "Gallery photo updated",
  );
  const remove = useGalleryMutation(() => deleteGalleryImage(image.id), "Gallery photo deleted");
  const busy = save.isPending || remove.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);
    save.mutate({
      altText: String(form.get("altText") ?? "").trim() || null,
      sortOrder: Number(form.get("sortOrder") || NaN),
      isActive: form.has("isActive"),
    });
  }

  return (
    <li className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-video bg-slate-100">
        <Image
          src={image.imageUrl}
          alt={image.altText ?? ""}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
          className="object-cover"
        />
        <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          {image.isActive ? "Visible" : "Hidden"}
        </span>
      </div>
      <form noValidate onSubmit={submit} className="space-y-4 p-4">
        <fieldset disabled={busy} className="space-y-3">
          <label className="block space-y-1 text-sm font-medium">
            <span>Alt text</span>
            <input
              name="altText"
              maxLength={255}
              defaultValue={image.altText ?? ""}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>
              Display order
              <RequiredMark />
            </span>
            <input
              name="sortOrder"
              type="number"
              min={0}
              max={2147483647}
              required
              defaultValue={image.sortOrder}
              className={inputClass}
            />
          </label>
          <label className="flex min-h-9 items-center gap-2 text-sm font-medium">
            <input name="isActive" type="checkbox" defaultChecked={image.isActive} />
            Show in public gallery
          </label>
        </fieldset>

        {save.error && (
          <p role="alert" className="text-sm text-red-800">
            {getErrorMessage(save.error)}
          </p>
        )}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          <Button type="submit" variant="secondary" disabled={busy}>
            {save.isPending ? "Saving…" : "Save photo"}
          </Button>
          <DeleteConfirmation
            label="Delete"
            title="Delete gallery photo?"
            description="This photo will be permanently removed from the site gallery."
            disabled={busy}
            onConfirm={() => remove.mutateAsync()}
          />
        </div>
      </form>
    </li>
  );
}

export default function GalleryManager() {
  const gallery = useGallery();
  const upload = useGalleryMutation(uploadGalleryImages, "Gallery photos uploaded");
  const removeAll = useDeleteAllGallery();
  const pendingChanges = useIsMutating({ mutationKey: galleryKeys.all });
  const photoCount = gallery.data?.length ?? 0;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Website</p>
        <h1 className="text-3xl font-bold text-primary">Gallery</h1>
        <p className="text-sm text-slate-600">
          Manage the photos shown in the public site gallery.
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          {gallery.data
            ? `${photoCount} ${photoCount === 1 ? "photo" : "photos"} in the site gallery`
            : "Loading photo count…"}
        </p>
        <DangerConfirmation
          label={
            <>
              <Trash2 aria-hidden="true" className="size-4" /> Delete all photos
            </>
          }
          title={`Delete all ${photoCount} gallery photos?`}
          description="All photos in the site gallery, including hidden photos, will be permanently removed. This cannot be undone."
          confirmLabel="Delete all photos"
          pendingLabel="Deleting all photos…"
          icon={Trash2}
          filledTrigger
          disabled={!photoCount || gallery.isFetching || pendingChanges > 0}
          onConfirm={() => removeAll.mutateAsync()}
        />
      </div>
      <fieldset disabled={removeAll.isPending} className="min-w-0 space-y-6">
        <GalleryUploadForm
          upload={upload.mutateAsync}
          pending={upload.isPending}
          error={upload.error}
        />
        {gallery.data ? (
          gallery.data.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {gallery.data.map((image) => (
                <GalleryCard key={image.id} image={image} />
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No gallery photos yet.
            </p>
          )
        ) : gallery.isError ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
            <p role="alert" className="text-sm text-red-800">
              {getErrorMessage(gallery.error)}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={gallery.isFetching}
              onClick={() => void gallery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <ModuleSkeleton label="Loading gallery" variant="cards" />
        )}
      </fieldset>
    </section>
  );
}
