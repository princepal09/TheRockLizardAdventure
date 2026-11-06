import { Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { TripKind } from "@/types/trip";

const copy = {
  treks: {
    label: "Curated Treks",
    roster: "India Trek Roster",
    image: "/image4.jpeg",
    routes: "Guided Treks Across India",
  },
  trips: {
    label: "Road & Bike Trips",
    roster: "India Road & Bike Roster",
    image: "/image4.jpeg",
    routes: "Road & Bike Journeys",
  },
  expeditions: {
    label: "Curated Expeditions",
    roster: "India Expedition Roster",
    image: "/image2.jpeg",
    routes: "High-Altitude Routes",
  },
} satisfies Record<TripKind, { label: string; roster: string; image: string; routes: string }>;

export default function HeroBanner({ kind }: { kind: TripKind }) {
  const { label, roster, image, routes } = copy[kind];
  const highlights = [
    { label: "Curated routes", value: routes, accent: "border-orange-500" },
    {
      label: "Pace & guild",
      value: kind === "trips" ? "Road & Bike Groups" : "Guided Group Treks",
      accent: "border-sky-500",
    },
    {
      label: "Operational hub",
      value: "1,640m Almora HQ",
      accent: "border-slate-300",
    },
    {
      label: "Route planning",
      value: kind === "trips" ? "Route & Vehicle Details" : "Acclimatization Focus",
      accent: "border-orange-500",
    },
  ];

  return (
    <section
      aria-labelledby="trip-listing-heading"
      className="relative isolate overflow-hidden border-b border-sky-100 bg-slate-900 px-4 py-10 text-white sm:px-6 sm:py-14 lg:py-16"
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/30" />
      <div className="mx-auto max-w-5xl text-center">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 text-xs font-medium text-white text-shadow-sm text-shadow-black/90"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden="true" className="mx-1.5 text-slate-200">
            /
          </span>
          <span aria-current="page">{label}</span>
        </nav>
        <p className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-orange-900 uppercase shadow-sm">
          <Mountain aria-hidden="true" className="size-3.5 shrink-0 text-orange-600" /> {roster} ·
          2026 Season Departures
        </p>
        <h1
          id="trip-listing-heading"
          className="mx-auto mt-4 max-w-4xl font-heading text-3xl leading-[1.05] font-semibold tracking-tight text-shadow-md text-shadow-black/90 sm:text-5xl lg:text-6xl"
        >
          {kind === "trips"
            ? "Open Roads, Two Wheels, New Horizons"
            : "Find Your Next Trail, Summit, and Mountain Escape"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white text-shadow-sm text-shadow-black/90 sm:text-base">
          Explore Uttarakhand (Kumaon + Garhwal), Kashmir and Maharashtra with our Almora-based
          team. Choose an itinerary that fits your experience, group and preferred destination.
        </p>
        <dl className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 rounded-xl border border-white/80 bg-white/90 p-3 text-left text-slate-900 shadow-sm sm:mt-8 sm:grid-cols-4">
          {highlights.map(({ label: title, value, accent }) => (
            <div key={title} className={`border-l-2 pl-2.5 font-mono ${accent}`}>
              <dt className="text-[9px] tracking-wide text-slate-600 uppercase">{title}</dt>
              <dd className="mt-0.5 text-xs font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
