"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTripMutation } from "@/hooks/trips/useTrips";
import { deleteTripItinerary, saveTripItinerary } from "@/lib/api/trips";
import type { ItineraryInput, TripDetail, TripKind } from "@/types/trip";
import { getErrorMessage } from "@/utils/error";
import { TripField, tripGridClass, tripInputClass, tripNumber, tripPanelClass, tripText } from "./TripFields";

function ItineraryForm({ kind, tripId, day }: { kind: TripKind; tripId: string; day?: TripDetail["itineraries"][number] }) {
  const save = useTripMutation(kind, (input: ItineraryInput) => saveTripItinerary(kind, tripId, input, day?.id), day ? "Itinerary day updated" : "Itinerary day added", tripId);
  const remove = useTripMutation(kind, (id: string) => deleteTripItinerary(kind, tripId, id), "Itinerary day deleted", tripId);
  const busy = save.isPending || remove.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    save.mutate({
      dayNumber: Number(tripText(form, "dayNumber")),
      title: tripText(form, "title"),
      description: tripText(form, "description") || null,
      distanceKm: tripNumber(form, "distanceKm"),
      altitudeMeters: tripNumber(form, "altitudeMeters"),
    }, { onSuccess: () => { if (!day) element.reset(); } });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-primary">{day ? `Day ${day.dayNumber}` : "Add an itinerary day"}</h3>
      <fieldset disabled={busy} className="space-y-3">
        <div className={tripGridClass}>
          <TripField label="Day number" name="dayNumber" type="number" min={1} max={2147483647} required defaultValue={day?.dayNumber} />
          <TripField label="Title" name="title" maxLength={255} required defaultValue={day?.title} />
          <TripField label="Distance (km)" name="distanceKm" type="number" min={0} max={999999.99} step="0.01" defaultValue={day?.distanceKm ?? ""} />
          <TripField label="Altitude (m)" name="altitudeMeters" type="number" min={-2147483648} max={2147483647} defaultValue={day?.altitudeMeters ?? ""} />
        </div>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>Description</span>
          <textarea name="description" className={tripInputClass} rows={3} defaultValue={day?.description ?? ""} />
        </label>
      </fieldset>
      {(save.error || remove.error) && <p role="alert" className="text-sm text-red-800">{getErrorMessage(save.error ?? remove.error)}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="secondary" disabled={busy}>{save.isPending ? "Saving…" : day ? "Save day" : "Add day"}</Button>
        {day && (
          <Button type="button" variant="destructive" disabled={busy} onClick={() => {
            if (window.confirm(`Delete day ${day.dayNumber}?`)) remove.mutate(day.id);
          }}>Delete day</Button>
        )}
      </div>
    </form>
  );
}

export default function TripItineraries({ kind, trip }: { kind: TripKind; trip: TripDetail }) {
  return (
    <section className={tripPanelClass} aria-labelledby="trip-itinerary-heading">
      <h2 id="trip-itinerary-heading" className="font-semibold text-primary">Itinerary</h2>
      {trip.itineraries.map((day) => <ItineraryForm key={day.id} kind={kind} tripId={trip.id} day={day} />)}
      <ItineraryForm kind={kind} tripId={trip.id} />
    </section>
  );
}
