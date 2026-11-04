import { Compass, SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedTreks } from "@/lib/api/published-treks";

import FeaturedTrekList from "./FeaturedTrekList";
import TrekAdvisor from "./TrekAdvisor";

async function FeaturedContent() {
  const treks = await getPublishedTreks().catch(() => null);
  if (!treks)
    return (
      <p role="status" className="py-6 text-sm text-slate-600">
        Featured treks are temporarily unavailable.
      </p>
    );
  return <FeaturedTrekList treks={treks.filter((trek) => trek.isFeatured)} />;
}

export default function FeaturedTreksSection() {
  return (
    <section
      aria-labelledby="featured-treks-title"
      className="bg-[#f3f0e8] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-orange-700 uppercase">
            <Compass aria-hidden="true" className="size-3.5" /> Tailored
            recommendations
          </p>
          <h2
            id="featured-treks-title"
            className="section-heading-accent mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Suggested Treks for Every Experience Level
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Explore handpicked routes for first-time Himalayan trekkers, family
            wilderness seekers, and seasoned high-altitude explorers.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 font-mono text-[10px] font-semibold tracking-wide text-slate-600">
          <SlidersHorizontal
            aria-hidden="true"
            className="size-3 text-sky-700"
          />{" "}
          VIBE MATCH{" "}
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-800">
            Choose your level
          </span>
        </p>
      </div>
      <Suspense
        fallback={
          <div role="status" className="mt-5">
            <span className="sr-only">Loading featured treks…</span>
            <Skeleton className="mb-5 h-8 w-full max-w-md bg-stone-200" />
            <div aria-hidden="true" className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-80 rounded-xl bg-stone-200"
                />
              ))}
            </div>
          </div>
        }
      >
        <FeaturedContent />
      </Suspense>
      <TrekAdvisor />
    </section>
  );
}
