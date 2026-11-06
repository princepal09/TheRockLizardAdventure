import ScrollReveal from "../../ScrollReveal";
import { ArrowRight, Flag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";
import { homepageTripLimits, selectHomepageTrips } from "@/lib/homepage-trips";

import ExpeditionCard from "./ExpeditionCard";

const gridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5";

async function ExpeditionCards({ showAll }: { showAll: boolean }) {
  const expeditions = await getPublishedExpeditions().catch(() => null);
  if (!expeditions)
    return (
      <p role="status" className="text-sm text-slate-600">
        Expeditions are temporarily unavailable.
      </p>
    );
  if (!expeditions.length)
    return <p className="text-sm text-slate-600">Published expeditions will appear here.</p>;

  const sorted = expeditions.toSorted((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  return (
    <div className={gridClass}>
      {(showAll ? sorted : selectHomepageTrips(expeditions, homepageTripLimits.expeditions)).map(
        (expedition, index) => (
          <ScrollReveal
            key={expedition.id}
            className="h-full [&>div]:h-full"
            delay={(index % 4) * 0.08}
          >
            <ExpeditionCard expedition={expedition} primary={index === 0} />
          </ScrollReveal>
        ),
      )}
    </div>
  );
}

export default function ExpeditionsGridSection({ showAll = false }: { showAll?: boolean }) {
  const Heading = showAll ? "h1" : "h2";
  return (
    <section
      aria-labelledby="expeditions-grid-heading"
      className="bg-[#f5f3ee] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10"
    >
      <ScrollReveal className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <p className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            <Flag aria-hidden="true" className="size-3" /> Curated departures
          </p>
          <Heading
            id="expeditions-grid-heading"
            className="section-heading-accent mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            {showAll ? "Expeditions Across India" : "Flagship Expeditions Across India"}
          </Heading>
        </div>
        {!showAll && (
          <Link
            href="/expeditions"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
          >
            View All Scheduled Expeditions <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        )}
      </ScrollReveal>
      <Suspense
        fallback={
          <div role="status">
            <span className="sr-only">Loading expeditions…</span>
            <div aria-hidden="true" className={gridClass}>
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-80 rounded-xl bg-stone-200" />
              ))}
            </div>
          </div>
        }
      >
        <ExpeditionCards showAll={showAll} />
      </Suspense>
    </section>
  );
}
