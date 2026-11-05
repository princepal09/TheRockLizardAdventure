"use client";

import Image from "next/image";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTripMutation } from "@/hooks/trips/useTrips";
import {
  deleteTripPhoto,
  updateTripPhoto,
  uploadTripCover,
  uploadTripPhotos,
} from "@/lib/api/trips";
import type { TripDetail, TripKind, TripPhotoInput } from "@/types/trip";
import { tripPhotoFormSchema } from "@/lib/validation/admin";
import { imageFileSchema } from "@/lib/validation/image";
import { getErrorMessage } from "@/utils/error";
import { TripField, tripPanelClass, tripText } from "./TripFields";
import GalleryUploadForm from "../GalleryUploadForm";
import { ImageUploadField } from "../ImageUploadField";
import DeleteConfirmation from "../DeleteConfirmation";

function CoverForm({ kind, trip }: { kind: TripKind; trip: TripDetail }) {
  const save = useTripMutation(
    kind,
    async (file: FormDataEntryValue | null) =>
      uploadTripCover(kind, trip.id, imageFileSchema.parse(file)),
    "Cover image updated",
    trip.id,
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (save.isPending) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    const file = form.get("coverImage");
    save.mutate(file, { onSuccess: () => element.reset() });
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-primary">Cover image</h3>
      {trip.coverImageUrl && (
        <Image
          src={trip.coverImageUrl}
          alt="Current trip cover"
          width={320}
          height={180}
          unoptimized
          className="aspect-video w-48 rounded-lg object-cover"
        />
      )}
      <fieldset disabled={save.isPending} className="space-y-3">
        <ImageUploadField label="Choose a cover image" name="coverImage" required />
      </fieldset>
      {save.error && (
        <p role="alert" className="text-sm text-red-800">
          {getErrorMessage(save.error)}
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={save.isPending}>
        {save.isPending ? "Saving…" : "Save cover"}
      </Button>
    </form>
  );
}

function PhotoForm({
  kind,
  tripId,
  photo,
}: {
  kind: TripKind;
  tripId: string;
  photo: TripDetail["images"][number];
}) {
  const save = useTripMutation(
    kind,
    async (input: TripPhotoInput) =>
      updateTripPhoto(kind, tripId, photo.id, tripPhotoFormSchema.parse(input)),
    "Photo updated",
    tripId,
  );
  const remove = useTripMutation(
    kind,
    () => deleteTripPhoto(kind, tripId, photo.id),
    "Photo deleted",
    tripId,
  );
  const busy = save.isPending || remove.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    save.mutate({
      altText: tripText(form, "altText") || null,
      caption: tripText(form, "caption") || null,
      sortOrder: Number(tripText(form, "sortOrder") || NaN),
    });
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className="min-w-0 space-y-3 rounded-lg border border-slate-200 p-4"
    >
      <Image
        src={photo.imageUrl}
        alt={photo.altText || "Trip gallery photo"}
        width={320}
        height={180}
        unoptimized
        className="aspect-video w-full rounded-lg object-cover"
      />
      <fieldset disabled={busy} className="space-y-3">
        <TripField
          label="Alt text"
          name="altText"
          maxLength={255}
          defaultValue={photo.altText ?? ""}
        />
        <TripField
          label="Caption"
          name="caption"
          maxLength={255}
          defaultValue={photo.caption ?? ""}
        />
        <TripField
          label="Display order"
          name="sortOrder"
          type="number"
          min={0}
          max={2147483647}
          required
          defaultValue={photo.sortOrder}
        />
      </fieldset>
      {save.error && (
        <p role="alert" className="text-sm text-red-800">
          {getErrorMessage(save.error)}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="secondary" disabled={busy}>
          {save.isPending ? "Saving…" : "Save photo"}
        </Button>
        <DeleteConfirmation
          label="Delete photo"
          title="Delete trip photo?"
          description="This photo will be permanently removed from the trip gallery."
          disabled={busy}
          onConfirm={() => remove.mutateAsync()}
        />
      </div>
    </form>
  );
}

export default function TripPhotos({ kind, trip }: { kind: TripKind; trip: TripDetail }) {
  const upload = useTripMutation(
    kind,
    (files: File[]) => uploadTripPhotos(kind, trip.id, files),
    "Photos uploaded",
    trip.id,
  );

  return (
    <section className={tripPanelClass} aria-labelledby="trip-photos-heading">
      <h2 id="trip-photos-heading" className="font-semibold text-primary">
        Photos
      </h2>
      <CoverForm key={trip.coverImageUrl} kind={kind} trip={trip} />
      <GalleryUploadForm
        upload={upload.mutateAsync}
        pending={upload.isPending}
        error={upload.error}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {trip.images.map((photo) => (
          <PhotoForm key={photo.id} kind={kind} tripId={trip.id} photo={photo} />
        ))}
      </div>
    </section>
  );
}
