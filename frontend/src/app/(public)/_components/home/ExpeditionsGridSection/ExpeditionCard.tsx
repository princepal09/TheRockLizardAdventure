"use client";

import { canOptimizeImage, imageLoaderFor } from "@/lib/image-optimization";
import { ArrowRight, MapPin, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublishedExpedition } from "@/lib/api/published-expeditions";

export default function ExpeditionCard({
  expedition,
  primary,
}: {
  expedition: PublishedExpedition;
  primary?: boolean;
}) {
  const href = `/expeditions/${encodeURIComponent(expedition.slug)}`;
  const image = expedition.coverImageUrl;
  const altitude = expedition.maxAltitudeMeters?.toLocaleString("en-IN");
  const location = [expedition.startingPoint, expedition.endingPoint]
    .filter(Boolean)
    .join(" • ");
  const grade = expedition.difficulty.toLowerCase().replaceAll("_", " ");
  const gradeClass =
    expedition.difficulty === "EASY"
      ? "bg-emerald-50 text-emerald-800"
      : expedition.difficulty === "MODERATE"
        ? "bg-sky-50 text-sky-800"
        : "bg-violet-50 text-violet-800";

  return (
    <Card className="gap-3 border border-stone-200 bg-[#fffefa] py-0! ring-0!">
      <Link
        href={href}
        aria-label={`View ${expedition.name}`}
        className="relative grid aspect-[5/4] place-items-center overflow-hidden bg-slate-800 text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
      >
        {image && /^(?:https?:\/\/|\/(?!\/))/i.test(image) ? (
          <Image src={image} alt="" fill loader={imageLoaderFor(image)} unoptimized={!canOptimizeImage(image)} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <Mountain aria-hidden="true" className="size-8 text-slate-400" />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-slate-950/65 to-transparent"
        />
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-1 font-mono text-[9px] font-bold tracking-widest uppercase ${primary ? "bg-orange-500 text-slate-950" : "bg-slate-950/85 text-sky-200"}`}
        >
          {expedition.isFeatured
            ? "Flagship expedition"
            : "Himalayan expedition"}
        </span>
        {altitude && (
          <span className="absolute right-2 bottom-2 rounded bg-slate-950/85 px-2 py-1 font-mono text-[10px]">
            {altitude} m peak
          </span>
        )}
      </Link>
      <CardHeader>
        <CardTitle className="font-sans! font-bold">
          <h3>{expedition.name}</h3>
        </CardTitle>
        {location && (
          <p className="flex items-start gap-1 text-xs text-slate-600">
            <MapPin
              aria-hidden="true"
              className="size-3.5 shrink-0 text-orange-700"
            />
            {location}
          </p>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <dl className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between gap-2">
            <dt>Duration</dt>
            <dd className="text-right font-mono font-semibold text-slate-900">
              {expedition.durationDays}{" "}
              {expedition.durationDays === 1 ? "day" : "days"}
            </dd>
          </div>
          {altitude && (
            <div className="flex justify-between gap-2">
              <dt>Max altitude</dt>
              <dd className="text-right font-mono font-semibold text-slate-900">
                {altitude} m
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <dt>Grade</dt>
            <dd
              className={`rounded px-1.5 font-semibold capitalize ${gradeClass}`}
            >
              {grade}
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="border-0! bg-transparent! pt-0!">
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold ${primary ? "bg-slate-900 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
        >
          Expedition Brief{" "}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
