import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";
import { ArrowRight, CalendarDays, MapPin, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import type { PublicListingTrip, TripKind } from "@/types/trip";

import { formatTripPrice } from "@/types/format-trip-price";

export default function FeaturedSpotlightCard({
  kind,
  trip,
}: {
  kind: TripKind;
  trip: PublicListingTrip;
}) {
  const [failed, setFailed] = useState(false);
  const image =
    trip.coverImageUrl && /^(?:https?:\/\/|\/(?!\/))/i.test(trip.coverImageUrl)
      ? trip.coverImageUrl
      : null;
  const location = [
    ...new Set([trip.region?.name, trip.startingPoint, trip.endingPoint].filter(Boolean)),
  ].join(" · ");
  const seasons = trip.seasons
    ?.map(({ season }) => season?.name)
    .filter(Boolean)
    .join(", ");
  const amount = formatTripPrice(trip);
  const facts = [
    {
      label: "Max elevation",
      value:
        trip.maxAltitudeMeters != null
          ? `${trip.maxAltitudeMeters.toLocaleString("en-IN")} m`
          : null,
    },
    {
      label: "Duration",
      value: `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`,
    },
    { label: "Season window", value: seasons },
    {
      label: "Trail grade",
      value: trip.difficulty.toLowerCase().replaceAll("_", " "),
    },
  ];

  return (
    <Card className="grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0! text-slate-900 shadow-sm ring-0! md:grid-cols-[1.4fr_1fr]">
      <div className="relative grid min-h-56 place-items-center bg-slate-200 md:min-h-full">
        {image && !failed ? (
          <Image
            src={image}
            alt=""
            fill
            loader={imageLoaderFor(image)}
            unoptimized={!canOptimizeImage(image)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            onError={() => setFailed(true)}
            className="object-cover"
          />
        ) : (
          <Mountain aria-hidden="true" className="size-14 text-slate-500" />
        )}
      </div>
      <div className="min-w-0 space-y-4 p-5 sm:p-6 lg:p-8">
        {location && (
          <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-sky-700" />
            {location}
          </p>
        )}
        <div>
          {trip.isFeatured && (
            <p className="mb-1 font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
              Featured route
            </p>
          )}
          <h3 className="font-heading text-3xl leading-tight font-semibold sm:text-4xl">
            {trip.name}
          </h3>
          {trip.summary && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{trip.summary}</p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-2">
          {facts
            .filter(({ value }) => value)
            .map(({ label, value }) => (
              <div key={label} className="min-w-0 rounded-lg bg-white p-2.5">
                <dt className="font-mono text-[10px] tracking-wide text-slate-600 uppercase">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-bold break-words capitalize">{value}</dd>
              </div>
            ))}
        </dl>
        <div className="space-y-3 border-t border-slate-100 pt-3">
          {amount && (
            <p>
              <span className="block font-mono text-[10px] tracking-wide text-slate-600 uppercase">
                Published price
              </span>
              <strong className="font-mono text-xl">{amount}</strong>
            </p>
          )}
          <Link
            href={`/${kind}/${encodeURIComponent(trip.slug)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-[#ffffff] hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
          >
            <CalendarDays aria-hidden="true" className="size-4" /> View{" "}
            {kind === "treks" ? "Trek" : "Expedition"} Details{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
