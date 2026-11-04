"use client";

import { useState } from "react";

import type { PublicListingTrip, TripKind } from "@/types/trip";

import FeaturedSpotlightCard from "../FeaturedSpotlightCard";
import TrekFilterToolbar, {
  defaultFilters,
  type TripFilters,
} from "../TrekFilterToolbar";
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
  const term = search.toLowerCase();
  const matched = trips.filter(
    (trip) =>
      (!term || trip.name.toLowerCase().includes(term)) &&
      (!filters.region || filters.region === trip.regionId) &&
      (!filters.grade || filters.grade === trip.difficulty) &&
      (!filters.duration || filters.duration === String(trip.durationDays)) &&
      (!filters.season ||
        trip.seasons?.some(({ seasonId }) => seasonId === filters.season)) &&
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
      <TrekFilterToolbar
        trips={trips}
        filters={filters}
        onChange={setFilters}
        count={matched.length}
        query={search}
        onReset={() => {
          setFilters(defaultFilters);
          setSearch("");
        }}
      />
      {spotlight ? (
        <>
          <FeaturedSpotlightCard
            key={spotlight.id}
            kind={kind}
            trip={spotlight}
          />
          {others.length > 0 && <TripDirectory kind={kind} trips={others} />}
        </>
      ) : (
        <p
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600"
        >
          {trips.length
            ? `No ${kind} match your filters.`
            : `Published ${kind} will appear here.`}
        </p>
      )}
    </div>
  );
}
