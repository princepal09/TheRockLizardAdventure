import { tripEnquiryHref } from "@/lib/trip-enquiry";
import type { TripKind } from "@/types/trip";
import Link from "next/link";

import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";

import DossierIcon from "./DossierIcon";
import DossierReveal from "./DossierReveal";
import TripPhoto from "./TripPhoto";

export default function DossierHero({ trip, kind }: { trip: PublishedTripDetail; kind: TripKind }) {
  const heroImage = trip.coverImageUrl ?? trip.images[0]?.imageUrl;
  const facts = [
    ...(kind === "trips"
      ? [
          ["Trip type", trip.tripType === "BIKE" ? "Bike trip" : "Road trip"],
          ["Route distance", trip.distanceKm == null ? null : `${trip.distanceKm} km`],
        ]
      : []),
    [
      "Elevation",
      trip.maxAltitudeMeters == null ? null : `${trip.maxAltitudeMeters.toLocaleString("en-IN")} m`,
    ],
    ["Grade", trip.difficulty.replaceAll("_", " ").toLowerCase()],
    ["Duration", `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`],
    ["Season", trip.seasons.map(({ season }) => season.name).join(", ")],
  ];

  return (
    <section
      aria-labelledby="dossier-title"
      className="relative isolate flex min-h-[clamp(25rem,38vw,34rem)] items-center overflow-hidden bg-slate-900 text-white"
    >
      <div className="absolute inset-0 -z-20">
        <TripPhoto key={heroImage} src={heroImage} alt="" hero />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#0f172af0,transparent_82%),linear-gradient(90deg,#0f172ab3,#0f172a33)]"
      />
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:py-12 xl:px-10">
        <DossierReveal>
          <h1
            id="dossier-title"
            className="max-w-4xl font-heading text-[clamp(2.25rem,4.65vw,4.25rem)] leading-[1.02] font-bold tracking-tight text-shadow-sm"
          >
            {trip.name}
          </h1>
          {trip.summary && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {trip.summary}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 lg:mt-12">
            <dl className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {facts
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-24 rounded-lg border border-slate-700/70 bg-[#111a2c]/95 px-3 py-2.5"
                  >
                    <dt className="font-mono text-[10px] text-slate-400 uppercase">{label}</dt>
                    <dd className="mt-1 font-mono text-sm font-bold capitalize">{value}</dd>
                  </div>
                ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {trip.images.length > 0 && (
                <a
                  href="#trip-gallery"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-semibold hover:bg-white/20"
                >
                  <DossierIcon name="hero-2" /> Show All {trip.images.length} Photos
                </a>
              )}
              <Link
                href={tripEnquiryHref(kind, trip.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
              >
                <DossierIcon name="hero-3" /> Reserve Slot
              </Link>
            </div>
          </div>
        </DossierReveal>
      </div>
    </section>
  );
}
