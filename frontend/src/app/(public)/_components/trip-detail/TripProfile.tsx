import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";
import type { SiteSettings } from "@/types/site-settings";
import { formatTripPrice } from "@/types/format-trip-price";

import CommandDesk from "./CommandDesk";
import DossierIcon from "./DossierIcon";

export default function TripProfile({
  trip,
  settings,
}: {
  trip: PublishedTripDetail;
  settings: SiteSettings | null;
}) {
  const price = formatTripPrice(trip);
  const seasons = trip.seasons.map(({ season }) => season.name).join(", ");
  const metrics = [
    {
      label: "Location",
      value: trip.startingPoint ?? trip.region?.name,
      detail: trip.startingPoint ? trip.region?.name : undefined,
      icon: "metric-1",
    },
    {
      label: "Duration",
      value: `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`,
      detail: trip.itineraries.length
        ? `${trip.itineraries.length} itinerary ${trip.itineraries.length === 1 ? "entry" : "entries"}`
        : undefined,
      icon: "metric-2",
    },
    {
      label: "Max Altitude",
      value:
        trip.maxAltitudeMeters == null
          ? null
          : `${trip.maxAltitudeMeters.toLocaleString("en-IN")} m`,
      detail:
        trip.maxAltitudeMeters == null
          ? undefined
          : `${Math.round(trip.maxAltitudeMeters / 0.3048).toLocaleString("en-IN")} ft`,
      icon: "metric-3",
    },
    {
      label: "Route Distance",
      value:
        trip.distanceKm == null ? null : `${Number(trip.distanceKm).toLocaleString("en-IN")} km`,
      icon: "metric-4",
      detail: trip.endingPoint ? `Finish: ${trip.endingPoint}` : undefined,
    },
    {
      label: "Grade",
      value: trip.difficulty.replaceAll("_", " ").toLowerCase(),
      icon: "metric-5",
    },
    {
      label: "Published Tariff",
      value: price,
      icon: "metric-6",
      detail: price ? trip.currency : undefined,
    },
  ];

  return (
    <div
      id="trip-overview"
      className="grid scroll-mt-20 gap-4 lg:grid-cols-[minmax(0,2.05fr)_minmax(0,1fr)]"
    >
      <Card className="min-w-0 gap-4 rounded-xl border border-stone-200 bg-white p-4 text-slate-900 ring-0! sm:p-5">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-700">
            <DossierIcon name="metric-0" />
          </span>
          <div>
            <h2 className="section-heading-accent font-mono text-xs font-bold tracking-widest text-orange-800 uppercase">
              Technical Profile Telemetry
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {[trip.startingPoint, trip.endingPoint].filter(Boolean).join(" → ") || trip.name}
            </p>
          </div>
          {trip.region?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-700 sm:ml-auto">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              {trip.region.name}
            </span>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {metrics
            .filter(({ value }) => value)
            .map(({ label, value, icon, detail }) => (
              <div
                key={label}
                className={`min-h-24 min-w-0 rounded-xl border p-3 ${label === "Max Altitude" ? "border-orange-200 bg-orange-50" : "border-slate-100 bg-[#eef3f8]"}`}
              >
                <dt className="flex items-center justify-between gap-2 text-xs text-slate-600">
                  {label}
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-md ${label === "Max Altitude" ? "bg-orange-500" : "bg-orange-100/80"}`}
                  >
                    <DossierIcon name={icon} />
                  </span>
                </dt>
                <dd className="mt-2 break-words text-base font-bold capitalize">
                  {value}
                  {detail && (
                    <span
                      className={`mt-0.5 block font-mono text-[10px] font-normal normal-case ${label === "Max Altitude" ? "text-orange-800" : "text-slate-600"}`}
                    >
                      {detail}
                    </span>
                  )}
                </dd>
              </div>
            ))}
        </dl>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 font-mono text-[10px] text-slate-600">
          {seasons && (
            <>
              <span className="rounded bg-sky-50 px-2 py-1 font-bold text-sky-800 uppercase">
                Season windows
              </span>
              <span>{seasons}</span>
            </>
          )}
          <span
            aria-hidden="true"
            className="ml-auto h-0.5 w-20 bg-linear-to-r from-transparent via-sky-500 to-transparent"
          />
        </div>
      </Card>
      <CommandDesk settings={settings} />
    </div>
  );
}
