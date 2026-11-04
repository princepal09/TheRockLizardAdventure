import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";

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
        <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Route Itinerary
        </h2>
      </div>
      <ol className="space-y-3">
        {itinerary.map(
          ({
            id,
            dayNumber,
            title,
            description,
            altitudeMeters,
            distanceKm,
          }) => (
            <li key={id} className="rounded-xl bg-slate-100 px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-md bg-orange-500 px-2 py-1 font-mono text-[10px] font-bold text-[#ffffff] uppercase">
                  Day {dayNumber}
                </span>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="ml-auto font-mono text-xs text-slate-600">
                  {[
                    altitudeMeters != null
                      ? `${altitudeMeters.toLocaleString("en-IN")} m`
                      : null,
                    distanceKm != null ? `${distanceKm} km` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              {description && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {description}
                </p>
              )}
            </li>
          ),
        )}
      </ol>
    </Card>
  );
}
