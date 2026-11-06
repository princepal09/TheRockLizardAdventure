"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";
import { ArrowRight, CalendarDays, Clock, MapPin, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicListingTrip, TripKind } from "@/types/trip";

import { formatTripPrice } from "../../../../../types/format-trip-price";

export default function TrekCard({ trip, kind }: { trip: PublicListingTrip; kind: TripKind }) {
  const [failed, setFailed] = useState(false);
  const href = `/${kind}/${encodeURIComponent(trip.slug)}`;
  const image =
    trip.coverImageUrl && /^(?:https?:\/\/|\/(?!\/))/i.test(trip.coverImageUrl)
      ? trip.coverImageUrl
      : null;
  const seasons = trip.seasons
    ?.map(({ season }) => season?.name)
    .filter(Boolean)
    .join(", ");
  const price = formatTripPrice(trip);

  return (
    <Card className="h-full gap-3 rounded-xl border border-slate-200 bg-white py-0! text-slate-900 shadow-sm ring-0!">
      <Link
        href={href}
        prefetch={false}
        aria-label={`View ${trip.name}`}
        className="group relative grid aspect-[16/9] shrink-0 place-items-center overflow-hidden bg-slate-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sky-700"
      >
        {image && !failed ? (
          <Image
            src={image}
            alt=""
            fill
            loader={imageLoaderFor(image)}
            unoptimized={!canOptimizeImage(image)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            onError={() => setFailed(true)}
            className="object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105"
          />
        ) : (
          <Mountain aria-hidden="true" className="size-8 text-slate-500" />
        )}
      </Link>
      <CardHeader>
        {trip.tripType && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-orange-800">
            {trip.tripType === "BIKE" ? "Bike trip" : "Road trip"}
          </p>
        )}
        <CardTitle className="font-sans! text-base font-bold">
          <h4>{trip.name}</h4>
        </CardTitle>
        {trip.summary && (
          <CardDescription className="line-clamp-3 text-xs leading-relaxed text-slate-600">
            {trip.summary}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-bold tracking-wide uppercase">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700">
            <Clock aria-hidden="true" className="size-3" />
            {trip.durationDays} {trip.durationDays === 1 ? "day" : "days"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-orange-800">
            <Mountain aria-hidden="true" className="size-3" />
            {trip.difficulty.replaceAll("_", " ")}
          </span>
          {seasons && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-sky-800">
              <CalendarDays aria-hidden="true" className="size-3 shrink-0" />
              {seasons}
            </span>
          )}
        </div>
        {(trip.startingPoint || trip.region?.name || trip.maxAltitudeMeters != null) && (
          <ul className="space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-600">
            {(trip.startingPoint || trip.region?.name) && (
              <li className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-orange-700" />
                {trip.startingPoint || trip.region?.name}
              </li>
            )}
            {trip.maxAltitudeMeters != null && (
              <li className="flex items-center gap-1.5">
                <Mountain aria-hidden="true" className="size-3.5 shrink-0 text-orange-700" />
                {trip.maxAltitudeMeters.toLocaleString("en-IN")} m max elevation
              </li>
            )}
          </ul>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex-wrap justify-between gap-2 border-slate-100 bg-slate-50/70!">
        {price && (
          <p>
            <span className="block font-mono text-[9px] tracking-wide text-slate-600 uppercase">
              Published price
            </span>
            <strong className="font-mono text-base">{price}</strong>
          </p>
        )}
        <Link
          href={href}
          prefetch={false}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border bg-secondary text-[#ffffff] border-slate-200 px-2.5 py-1.5 text-xs font-bold hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-sky-700"
        >
          {kind === "trips" ? "View Trip Details" : "View Trail Details"}{" "}
          <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
