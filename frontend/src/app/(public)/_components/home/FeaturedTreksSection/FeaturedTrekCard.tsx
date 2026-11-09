import { ArrowRight, Mountain, Star } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TrekSearchItem } from "@/lib/api/published-treks";
import { homepageTrekCoverSizes } from "@/lib/homepage-trips";

import TripPhoto from "../../trip-detail/TripPhoto";

export default function FeaturedTrekCard({
  trek,
  highlighted,
}: {
  trek: TrekSearchItem;
  highlighted: boolean;
}) {
  const href = `/treks/${encodeURIComponent(trek.slug)}`;
  const elevation =
    trek.maxAltitudeMeters === null ? null : `${trek.maxAltitudeMeters.toLocaleString("en-IN")} m`;
  const level = trek.difficulty.toLowerCase().replaceAll("_", " ");

  return (
    <Card
      className={`gap-3 border bg-[#fffefa] py-0! ring-0! ${highlighted ? "border-orange-500" : "border-stone-200"}`}
    >
      <Link
        href={href}
        aria-label={`Explore ${trek.name}`}
        className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-slate-800 text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
      >
        <TripPhoto
          key={trek.coverImageUrl}
          src={trek.coverImageUrl}
          alt=""
          sizes={homepageTrekCoverSizes}
          fallback={<Mountain aria-hidden="true" className="size-8 text-slate-400" />}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent"
        />
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[9px] font-semibold tracking-wide uppercase ${highlighted ? "bg-orange-500 text-[#ffffff]" : "bg-slate-900/85 text-sky-100"}`}
        >
          <Star aria-hidden="true" className="size-3" /> Featured trek
        </span>
        {elevation && (
          <span className="absolute right-2 bottom-2 rounded bg-slate-950/80 px-2 py-1 font-mono text-[10px]">
            {elevation} peak
          </span>
        )}
      </Link>
      <CardHeader>
        <CardTitle className="font-sans! font-bold">
          <h3>{trek.name}</h3>
        </CardTitle>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-slate-600">
          <span
            className={`rounded px-1.5 py-0.5 font-semibold capitalize ${trek.difficulty === "EASY" ? "bg-emerald-50 text-emerald-800" : trek.difficulty === "MODERATE" ? "bg-sky-50 text-sky-800" : "bg-violet-50 text-violet-800"}`}
          >
            z{level}
          </span>
          <span>
            {trek.durationDays} {trek.durationDays === 1 ? "day" : "days"}
          </span>
        </p>
      </CardHeader>
      {trek.summary && (
        <CardContent>
          <CardDescription className="text-xs leading-relaxed text-slate-600">
            {trek.summary}
          </CardDescription>
        </CardContent>
      )}
      <CardFooter className="mt-auto border-0! bg-transparent! pt-0!">
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 ${highlighted ? "bg-orange-500 text-[#ffffff] hover:bg-orange-400" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
        >
          Explore Itinerary <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
