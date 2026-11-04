import { ArrowDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PublicListingTrip, TripKind } from "@/types/trip";

import TrekCard from "../TrekCard";

const initialCount = 6;

export default function TripDirectory({
  trips,
  kind,
}: {
  trips: PublicListingTrip[];
  kind: TripKind;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? trips : trips.slice(0, initialCount);

  return (
    <section aria-labelledby="trip-directory-title" className="space-y-5 pt-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            Expedition directory
          </p>
          <h3
            id="trip-directory-title"
            className="section-heading-accent mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Curated Uttarakhand Itineraries
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-slate-600">
          Compare route grades, duration, and seasons to find an itinerary that
          fits your plans.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((trip) => (
          <li key={trip.id} className="min-w-0">
            <TrekCard key={trip.coverImageUrl} trip={trip} kind={kind} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-sky-50 px-4 py-3">
        <p className="text-xs text-slate-700">
          <strong>Need a custom alpine departure?</strong> Ask Basecamp about
          private routes for your group.
        </p>
        {!showAll && trips.length > initialCount && (
          <Button type="button" onClick={() => setShowAll(true)}>
            Show all {trips.length} routes <ArrowDown aria-hidden="true" />
          </Button>
        )}
      </div>
    </section>
  );
}
