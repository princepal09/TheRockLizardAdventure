"use client";

import ScrollReveal from "../../ScrollReveal";

import { useState } from "react";

import type { PublicListingTrip, TripKind } from "@/types/trip";

import FeaturedSpotlightCard from "../FeaturedSpotlightCard";
import TrekFilterToolbar, { defaultFilters, type TripFilters } from "../TrekFilterToolbar";
import TripDirectory from "./TripDirectory";

export default function TripDiscoveryResults({
  kind,
  trips,
  query,
}: {
  kind: TripKind;
  trips: PublicListingTrip[];
  query: string;
}) {
  const [filters, setFilters] = useState<TripFilters>(defaultFilters);
  const [search, setSearch] = useState(query);
  const [tripType, setTripType] = useState("");
  const term = search.toLowerCase();
  const matched = trips.filter(
    (trip) =>
      (!tripType || trip.tripType === tripType) &&
      (!term || trip.name.toLowerCase().includes(term)) &&
      (!filters.region || filters.region === trip.regionId) &&
      (!filters.grade || filters.grade === trip.difficulty) &&
      (!filters.duration || filters.duration === String(trip.durationDays)) &&
      (!filters.season || trip.seasons?.some(({ seasonId }) => seasonId === filters.season)) &&
      (!filters.basecamp || filters.basecamp === trip.startingPoint),
  );
  matched.sort((a, b) => {
    if (filters.sort === "shortest") return a.durationDays - b.durationDays;
    if (filters.sort === "highest")
      return (b.maxAltitudeMeters ?? -1) - (a.maxAltitudeMeters ?? -1);
    return Number(b.isFeatured) - Number(a.isFeatured);
  });
  const [spotlight, ...others] = matched;

  return (
    <div className="space-y-6">
      {kind === "trips" && (
        <div role="group" aria-label="Trip type" className="flex flex-wrap justify-center gap-2">
          {[
            ["", "All trips"],
            ["ROAD", "Road trips"],
            ["BIKE", "Bike trips"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={tripType === value}
              onClick={() => setTripType(value)}
              className="min-h-11 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <TrekFilterToolbar
        trips={trips}
        filters={filters}
        onChange={setFilters}
        count={matched.length}
        query={search}
        onReset={() => {
          setFilters(defaultFilters);
          setTripType("");
          setSearch("");
        }}
      />
      {spotlight ? (
        <>
          <ScrollReveal key={spotlight.id}>
            <FeaturedSpotlightCard kind={kind} trip={spotlight} />
          </ScrollReveal>
          {others.length > 0 && <TripDirectory kind={kind} trips={others} />}
        </>
      ) : (
        <p
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600"
        >
          {trips.length ? `No ${kind} match your filters.` : `Published ${kind} will appear here.`}
        </p>
      )}
    </div>
  );
}
