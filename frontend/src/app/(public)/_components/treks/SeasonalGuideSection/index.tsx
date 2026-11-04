import { Thermometer } from "lucide-react";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublicSeasons } from "@/lib/api/public-seasons";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";
import { getPublishedTreks } from "@/lib/api/published-treks";
import type { TripKind } from "@/types/trip";

import SeasonCard from "./SeasonCard";

const gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-4";

async function SeasonalGuideCards({ kind }: { kind: TripKind }) {
  const getTrips =
    kind === "treks" ? getPublishedTreks : getPublishedExpeditions;
  const [seasons, trips] = await Promise.all([
    getPublicSeasons().catch(() => null),
    getTrips().catch(() => []),
  ]);

  if (!seasons)
    return (
      <p role="status" className="text-center text-sm text-slate-600">
        The seasonal guide is temporarily unavailable.
      </p>
    );
  if (!seasons.length)
    return (
      <p className="text-center text-sm text-slate-600">
        Seasonal information will appear here when available.
      </p>
    );

  return (
    <div className={gridClass}>
      {seasons.map((season) => (
        <SeasonCard
          key={season.id}
          season={season}
          kind={kind}
          routes={trips
            .filter((trip) =>
              trip.seasons?.some(({ seasonId }) => seasonId === season.id),
            )
            .slice(0, 2)}
        />
      ))}
    </div>
  );
}

export default function SeasonalGuideSection({ kind }: { kind: TripKind }) {
  return (
    <section
      aria-labelledby="seasonal-guide-heading"
      className="border-y border-sky-100 bg-[#eef5f8] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10"
    >
      <div className="mb-6 text-center">
        <p className="inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          <Thermometer aria-hidden="true" className="size-3" /> Altimetry &amp;
          Meteorology
        </p>
        <h2
          id="seasonal-guide-heading"
          className="section-heading-accent section-heading-accent--center mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          When to Trek in Uttarakhand
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Uttarakhand’s microclimates vary across bugyals and high glacial
          passes. Compare the season windows and routes before planning your
          departure.
        </p>
      </div>
      <Suspense
        fallback={
          <div role="status">
            <span className="sr-only">Loading seasonal guide…</span>
            <div aria-hidden="true" className={gridClass}>
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-48 rounded-xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        }
      >
        <SeasonalGuideCards kind={kind} />
      </Suspense>
    </section>
  );
}
