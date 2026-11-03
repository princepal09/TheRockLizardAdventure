"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTripMutation } from "@/hooks/trips/useTrips";
import { deleteTripPhoto, updateTripPhoto, uploadTripCover, uploadTripPhotos } from "@/lib/api/trips";
import type { TripDetail, TripKind, TripPhotoInput } from "@/types/trip";
import { getErrorMessage } from "@/utils/error";
import { TripField, TripUploadField, tripPanelClass, tripText } from "./TripFields";

function CoverForm({ kind, trip }: { kind: TripKind; trip: TripDetail }) {
  const save = useTripMutation(kind, (file: File) => uploadTripCover(kind, trip.id, file), "Cover image updated", trip.id);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (save.isPending) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    const file = form.get("coverImage");
    if (!(file instanceof File) || !file.name) return;
    save.mutate(file, { onSuccess: () => element.reset() });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-primary">Cover image</h3>
      {trip.coverImageUrl && <Image src={trip.coverImageUrl} alt="Current trip cover" width={320} height={180} unoptimized className="aspect-video w-48 rounded-lg object-cover" />}
      <fieldset disabled={save.isPending} className="space-y-3">
        <TripUploadField label="Choose a cover image" name="coverImage" required />
      </fieldset>
      {save.error && <p role="alert" className="text-sm text-red-800">{getErrorMessage(save.error)}</p>}
      <Button type="submit" variant="secondary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save cover"}</Button>
    </form>
  );
}

function PhotoForm({ kind, tripId, photo }: { kind: TripKind; tripId: string; photo: TripDetail["images"][number] }) {
  const save = useTripMutation(kind, (input: TripPhotoInput) => updateTripPhoto(kind, tripId, photo.id, input), "Photo updated", tripId);
  const remove = useTripMutation(kind, () => deleteTripPhoto(kind, tripId, photo.id), "Photo deleted", tripId);
  const busy = save.isPending || remove.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    save.mutate({
      altText: tripText(form, "altText") || null,
      caption: tripText(form, "caption") || null,
      sortOrder: Number(tripText(form, "sortOrder")),
    });
  }

  return (
    <form onSubmit={submit} className="min-w-0 space-y-3 rounded-lg border border-slate-200 p-4">
      <Image src={photo.imageUrl} alt={photo.altText || "Trip gallery photo"} width={320} height={180} unoptimized className="aspect-video w-full rounded-lg object-cover" />
      <fieldset disabled={busy} className="space-y-3">
        <TripField label="Alt text" name="altText" maxLength={255} defaultValue={photo.altText ?? ""} />
        <TripField label="Caption" name="caption" maxLength={255} defaultValue={photo.caption ?? ""} />
        <TripField label="Display order" name="sortOrder" type="number" min={0} max={2147483647} required defaultValue={photo.sortOrder} />
      </fieldset>
      {(save.error || remove.error) && <p role="alert" className="text-sm text-red-800">{getErrorMessage(save.error ?? remove.error)}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="secondary" disabled={busy}>{save.isPending ? "Saving…" : "Save photo"}</Button>
        <Button type="button" variant="destructive" disabled={busy} onClick={() => {
          if (window.confirm("Delete this trip photo?")) remove.mutate();
        }}>Delete photo</Button>
      </div>
    </form>
  );
}

export default function TripPhotos({ kind, trip }: { kind: TripKind; trip: TripDetail }) {
  const [uploadError, setUploadError] = useState("");
  const upload = useTripMutation(kind, (files: File[]) => uploadTripPhotos(kind, trip.id, files), "Photos uploaded", trip.id);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (upload.isPending) return;
    const element = event.currentTarget;
    const files = new FormData(element).getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
    setUploadError("");
    if (!files.length || files.length > 5 || files.some((file) => file.size > 5 * 1024 * 1024)) {
      setUploadError("Choose 1 to 5 images, up to 5 MB each.");
      return;
    }

    upload.mutate(files, { onSuccess: () => element.reset() });
  }

  return (
    <section className={tripPanelClass} aria-labelledby="trip-photos-heading">
      <h2 id="trip-photos-heading" className="font-semibold text-primary">Photos</h2>
      <CoverForm key={trip.coverImageUrl} kind={kind} trip={trip} />
      <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 p-4">
        <TripUploadField label="Choose gallery photos" name="images" multiple required disabled={upload.isPending} />
        {(uploadError || upload.error) && <p role="alert" className="text-sm text-red-800">{uploadError || getErrorMessage(upload.error)}</p>}
        <Button type="submit" variant="secondary" disabled={upload.isPending}>{upload.isPending ? "Uploading…" : "Upload photos"}</Button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {trip.images.map((photo) => <PhotoForm key={photo.id} kind={kind} tripId={trip.id} photo={photo} />)}
      </div>
    </section>
  );
}
