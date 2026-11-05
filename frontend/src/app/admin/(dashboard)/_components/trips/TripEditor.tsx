"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  useTrip,
  useTripMutation,
  useTripOptions,
} from "@/hooks/trips/useTrips";
import { deleteTrip, saveTrip } from "@/lib/api/trips";
import { tripFormSchema } from "@/lib/validation/admin";
import { imageFileSchema } from "@/lib/validation/image";
import {
  tripDifficulties,
  tripStatuses,
  type TripDetail,
  type TripInput,
  type TripKind,
  type TripOption,
} from "@/types/trip";
import { getErrorMessage } from "@/utils/error";
import {
  TripField,
  tripGridClass,
  tripInputClass,
  tripNumber,
  tripPanelClass,
  tripText,
} from "./TripFields";
import { ImageUploadField, RequiredMark } from "../ImageUploadField";
import DeleteConfirmation from "../DeleteConfirmation";
import TripItineraries from "./TripItineraries";
import TripPhotos from "./TripPhotos";

const istOffsetMs = (5 * 60 + 30) * 60 * 1000;

function formatPublishedAt(value: string | null | undefined) {
  if (!value) return "";
  return new Date(Date.parse(value) + istOffsetMs).toISOString().slice(0, 19);
}

function TripForm({
  kind,
  trip,
  regions,
  seasons,
}: {
  kind: TripKind;
  trip?: TripDetail;
  regions: TripOption[];
  seasons: TripOption[];
}) {
  const router = useRouter();
  const label = kind === "treks" ? "Trek" : "Expedition";
  const save = useTripMutation(
    kind,
    async ({ input, cover }: { input: TripInput; cover?: File }) => {
      const details = tripFormSchema.parse(input);
      if (!trip)
        return saveTrip(
          kind,
          undefined,
          details,
          imageFileSchema.optional().parse(cover),
        );
      return saveTrip(kind, trip.id, details);
    },
    trip ? `${label} updated` : `${label} created`,
    trip?.id,
  );
  const remove = useTripMutation(
    kind,
    (id: string) => deleteTrip(kind, id),
    `${label} deleted`,
  );
  const busy = save.isPending || remove.isPending;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const element = event.currentTarget;
    const form = new FormData(element);
    const publishedAt = tripText(form, "publishedAt");
    const input: TripInput = {
      departureDates: tripText(form, "departureDates") || null,
      meetingPoint: tripText(form, "meetingPoint") || null,
      inclusions: tripText(form, "inclusions") || null,
      exclusions: tripText(form, "exclusions") || null,
      requiredGear: tripText(form, "requiredGear") || null,
      cancellationPolicy: tripText(form, "cancellationPolicy") || null,
      refundPolicy: tripText(form, "refundPolicy") || null,
      name: tripText(form, "name"),
      regionId: tripText(form, "regionId"),
      seasonIds: form.getAll("seasonIds").map(String),
      difficulty: tripText(form, "difficulty") as TripInput["difficulty"],
      status: tripText(form, "status") as TripInput["status"],
      durationDays: Number(tripText(form, "durationDays")),
      summary: tripText(form, "summary") || null,
      description: tripText(form, "description") || null,
      distanceKm: tripNumber(form, "distanceKm"),
      maxAltitudeMeters: tripNumber(form, "maxAltitudeMeters"),
      startingPoint: tripText(form, "startingPoint") || null,
      endingPoint: tripText(form, "endingPoint") || null,
      price: tripNumber(form, "price"),
      discountPrice: tripNumber(form, "discountPrice"),
      currency: tripText(form, "currency"),
      maxGroupSize: tripNumber(form, "maxGroupSize"),
      minAge: tripNumber(form, "minAge"),
      maxAge: tripNumber(form, "maxAge"),
      isFeatured: form.has("isFeatured"),
      publishedAt: publishedAt
        ? new Date(Date.parse(`${publishedAt}Z`) - istOffsetMs).toISOString()
        : null,
    };

    const file = form.get("coverImage");
    const cover = file instanceof File && file.name ? file : undefined;
    const saved = await save
      .mutateAsync({ input, cover })
      .catch(() => undefined);
    if (saved) {
      if (!trip) {
        element.reset();
        save.reset();
      }
      router.replace(`/admin/${kind}`);
    }
  }

  return (
    <form noValidate onSubmit={submit} className={tripPanelClass}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-primary">{label} details</h2>
        <p className="text-xs text-slate-600">
          <RequiredMark /> Required field
        </p>
      </header>
      <fieldset disabled={busy} className="space-y-5">
        <h3 className="text-sm font-semibold text-primary">
          Basics and publishing
        </h3>
        <div className={tripGridClass}>
          <TripField
            label="Name"
            name="name"
            required
            maxLength={200}
            defaultValue={trip?.name}
          />
          <label className="block space-y-1.5 text-sm font-medium">
            <span>
              Region
              <RequiredMark />
            </span>
            <select
              className={tripInputClass}
              name="regionId"
              required
              defaultValue={trip?.regionId ?? ""}
            >
              <option value="" disabled>
                Select a region
              </option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                  {region.isActive ? "" : " (inactive)"}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>
              Difficulty
              <RequiredMark />
            </span>
            <select
              className={tripInputClass}
              name="difficulty"
              required
              defaultValue={trip?.difficulty ?? "EASY"}
            >
              {tripDifficulties.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>Status</span>
            <select
              className={tripInputClass}
              name="status"
              defaultValue={trip?.status ?? "DRAFT"}
            >
              {tripStatuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <TripField
            label="Published at (IST)"
            name="publishedAt"
            type="datetime-local"
            step={1}
            defaultValue={formatPublishedAt(trip?.publishedAt)}
          />
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          Published trips appear in the public listing. Leave the publication date blank to set it automatically when publishing. The homepage highlights up to three of the most recently published featured treks.
        </p>
        <h3 className="border-t border-slate-200 pt-5 text-sm font-semibold text-primary">
          Route and group
        </h3>
        <div className={tripGridClass}>
          <TripField
            label="Duration (days)"
            name="durationDays"
            type="number"
            min={1}
            max={2147483647}
            required
            defaultValue={trip?.durationDays}
          />
          <TripField
            label="Distance (km)"
            name="distanceKm"
            type="number"
            min={0}
            max={999999.99}
            step="0.01"
            defaultValue={trip?.distanceKm ?? ""}
          />
          <TripField
            label="Max altitude (m)"
            name="maxAltitudeMeters"
            type="number"
            min={0}
            max={2147483647}
            defaultValue={trip?.maxAltitudeMeters ?? ""}
          />
          <TripField
            label="Max group size"
            name="maxGroupSize"
            type="number"
            min={1}
            max={2147483647}
            defaultValue={trip?.maxGroupSize ?? ""}
          />
          <TripField
            label="Starting point"
            name="startingPoint"
            maxLength={255}
            defaultValue={trip?.startingPoint ?? ""}
          />
          <TripField
            label="Ending point"
            name="endingPoint"
            maxLength={255}
            defaultValue={trip?.endingPoint ?? ""}
          />
          <TripField
            label="Minimum age"
            name="minAge"
            type="number"
            min={0}
            max={2147483647}
            defaultValue={trip?.minAge ?? ""}
          />
          <TripField
            label="Maximum age"
            name="maxAge"
            type="number"
            min={0}
            max={2147483647}
            defaultValue={trip?.maxAge ?? ""}
          />
        </div>
        <h3 className="border-t border-slate-200 pt-5 text-sm font-semibold text-primary">
          Pricing
        </h3>
        <div className={tripGridClass}>
          <TripField
            label="Price"
            name="price"
            type="number"
            min={0}
            max={99999999.99}
            step="0.01"
            defaultValue={trip?.price ?? ""}
          />
          <TripField
            label="Discount price"
            name="discountPrice"
            type="number"
            min={0}
            max={99999999.99}
            step="0.01"
            defaultValue={trip?.discountPrice ?? ""}
          />
          <TripField
            label="Currency"
            name="currency"
            required
            pattern="[A-Z]{3}"
            maxLength={3}
            defaultValue={trip?.currency ?? "INR"}
          />
        </div>
        <h3 className="border-t border-slate-200 pt-5 text-sm font-semibold text-primary">
          Content and seasons
        </h3>
        <TripField
          label="Summary"
          name="summary"
          maxLength={500}
          defaultValue={trip?.summary ?? ""}
        />
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Description</span>
          <textarea
            className={tripInputClass}
            name="description"
            rows={4}
            defaultValue={trip?.description ?? ""}
          />
        </label>
        <fieldset className="space-y-2 text-sm">
          <legend className="font-medium">Seasons</legend>
          <div className="flex flex-wrap gap-3">
            {seasons.map((season) => (
              <label key={season.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="seasonIds"
                  value={season.id}
                  defaultChecked={trip?.seasons.some(
                    ({ seasonId }) => seasonId === season.id,
                  )}
                />
                {season.name}
                {season.isActive ? "" : " (inactive)"}
              </label>
            ))}
            {!seasons.length && (
              <p className="text-slate-600">No seasons available.</p>
            )}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={trip?.isFeatured}
          />
          Featured {label.toLowerCase()}
        </label>
        <section
          className="space-y-4 border-t border-slate-200 pt-5"
          aria-labelledby="trip-planning-editor-title"
        >
          <h3
            id="trip-planning-editor-title"
            className="text-sm font-semibold text-primary"
          >
            Departure details and booking terms
          </h3>
          <p className="text-xs text-slate-600">
            Publish only confirmed client information. Leave unknown details
            blank; the public page will direct travellers to Basecamp.
          </p>
          {(
            [
              {
                name: "departureDates",
                label: "Confirmed departure dates",
                hint: "One start date per line, YYYY-MM-DD. Past dates are not displayed as upcoming departures.",
                maxLength: 2000,
              },
              {
                name: "meetingPoint",
                label: "Meeting point and reporting time",
                hint: "Exact address, landmark, reporting time and pickup instructions.",
                maxLength: 1000,
              },
              {
                name: "inclusions",
                label: "Price includes",
                hint: "One inclusion per line.",
                maxLength: 10000,
              },
              {
                name: "exclusions",
                label: "Price excludes",
                hint: "One exclusion per line.",
                maxLength: 10000,
              },
              {
                name: "requiredGear",
                label: "Required gear",
                hint: "One item per line. Include rental details where relevant.",
                maxLength: 10000,
              },
              {
                name: "cancellationPolicy",
                label: "Cancellation terms",
                hint: "Client-approved terms, deadlines and charges.",
                maxLength: 10000,
              },
              {
                name: "refundPolicy",
                label: "Refund terms",
                hint: "Client-approved eligibility, process and timelines.",
                maxLength: 10000,
              },
            ] as const
          ).map(({ name, label, hint, maxLength }) => (
            <label key={name} className="block space-y-1.5 text-sm font-medium">
              <span>{label}</span>
              <textarea
                name={name}
                rows={3}
                maxLength={maxLength}
                defaultValue={trip?.[name] ?? ""}
                className={tripInputClass}
                aria-describedby={`${name}-hint`}
              />
              <span
                id={`${name}-hint`}
                className="block text-xs font-normal text-slate-600"
              >
                {hint}
              </span>
            </label>
          ))}
        </section>
        {!trip && <ImageUploadField label="Cover image" name="coverImage" />}
      </fieldset>
      {save.error && (
        <p role="alert" className="text-sm text-red-800">
          {getErrorMessage(save.error)}
        </p>
      )}
      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <Button type="submit" disabled={busy} variant="secondary">
          {save.isPending
            ? "Saving…"
            : trip
              ? "Save details"
              : `Create ${label.toLowerCase()}`}
        </Button>
        {trip && (
          <DeleteConfirmation
            label={`Delete ${label.toLowerCase()}`}
            title={`Delete ${label.toLowerCase()}?`}
            description={`“${trip.name}” and its itinerary and photos will be permanently deleted.`}
            disabled={busy}
            onConfirm={async () => {
              await remove.mutateAsync(trip.id);
              router.replace(`/admin/${kind}`);
            }}
          />
        )}
      </div>
    </form>
  );
}

export default function TripEditor({
  kind,
  id,
}: {
  kind: TripKind;
  id?: string;
}) {
  const trip = useTrip(kind, id);
  const options = useTripOptions();
  const error = trip.error ?? options.error;
  const label = kind === "treks" ? "trek" : "expedition";

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <Link
        href={`/admin/${kind}`}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        ← Back to {kind}
      </Link>
      <h1 className="text-3xl font-bold break-words text-primary">
        {id ? (trip.data?.name ?? `Edit ${label}`) : `New ${label}`}
      </h1>
      {error ? (
        <div className={tripPanelClass}>
          <p role="alert" className="text-sm text-red-800">
            {getErrorMessage(error)}
          </p>
          <Button
            variant="outline"
            disabled={trip.isFetching || options.isFetching}
            onClick={() => {
              if (trip.isError) void trip.refetch();
              if (options.isError) void options.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : options.data && (!id || trip.data) ? (
        <>
          <TripForm
            key={trip.data?.id ?? "new"}
            kind={kind}
            trip={trip.data}
            {...options.data}
          />
          {trip.data && (
            <>
              <TripItineraries kind={kind} trip={trip.data} />
              <TripPhotos kind={kind} trip={trip.data} />
            </>
          )}
        </>
      ) : (
        <ModuleSkeleton label={`Loading ${label} editor`} variant="form" />
      )}
    </section>
  );
}
