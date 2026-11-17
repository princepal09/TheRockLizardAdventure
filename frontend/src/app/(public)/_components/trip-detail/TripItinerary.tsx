import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";

import TripDescription from "./TripDescription";

export default function TripItinerary({
  itinerary,
}: {
  itinerary: PublishedTripDetail["itineraries"];
}) {
  return (
    <Card
      id="trip-itinerary"
      className="scroll-mt-20 gap-4 border border-stone-200 bg-white p-5 text-slate-900 ring-0! sm:p-7"
    >
      <div>
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Day-by-day plan
        </p>
        <h2 className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Route Itinerary
        </h2>
      </div>
      <ol className="space-y-3">
        {itinerary.map(
          ({ id, dayNumber, title, description, descriptionRich, altitudeMeters, distanceKm }) => {
            const metrics = [
              altitudeMeters != null ? `${altitudeMeters.toLocaleString("en-IN")} m` : null,
              distanceKm != null ? `${distanceKm} km` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={id}>
                <details className="group rounded-xl bg-slate-100">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-mono text-xs font-bold text-orange-800 uppercase focus-visible:outline-2 focus-visible:outline-sky-700 [&::-webkit-details-marker]:hidden">
                    Day {dayNumber}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 shrink-0 text-slate-500 motion-safe:transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div className="space-y-2 border-t border-slate-200 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="text-sm font-bold">{title}</h3>
                      {metrics && <p className="font-mono text-xs text-slate-600">{metrics}</p>}
                    </div>
                    <TripDescription description={description} richDescription={descriptionRich} />
                  </div>
                </details>
              </li>
            );
          },
        )}
      </ol>
    </Card>
  );
}
