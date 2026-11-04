import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedTreks } from "@/lib/api/published-treks";

import RegionCarousel from "./RegionCarousel";

async function GalleryContent() {
  const treks = await getPublishedTreks().catch(() => null);
  if (!treks)
    return (
      <p role="status" className="py-6 text-sm text-slate-600">
        Treks are temporarily unavailable.
      </p>
    );
  if (!treks.length)
    return (
      <p className="py-6 text-sm text-slate-600">
        New treks will appear here when they’re published.
      </p>
    );
  return (
    <RegionCarousel
      treks={treks.map(({ id, name, slug, coverImageUrl }) => ({
        id,
        name,
        slug,
        coverImageUrl,
      }))}
    />
  );
}

export default function RegionGallerySection() {
  return (
    <section
      aria-labelledby="region-gallery-title"
      className="border-b border-stone-200 bg-[#f5f3ee] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-stone-200 pb-2">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-700 uppercase">
            Expedition architecture
          </p>
          <h2
            id="region-gallery-title"
            className="section-heading-accent mt-1 text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl"
          >
            Choose Your Mountain Discipline
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-600">
          Every trail is planned with specialized pacing, certified local
          mountain leads, and dedicated Pahadi trail chefs.
        </p>
      </div>
      <Suspense
        fallback={
          <div role="status">
            <span className="sr-only">Loading treks…</span>
            <div
              aria-hidden="true"
              className="grid auto-cols-[min(44%,9.25rem)] grid-flow-col gap-2.5 overflow-hidden"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-[1.15] rounded-xl bg-stone-200"
                />
              ))}
            </div>
          </div>
        }
      >
        <GalleryContent />
      </Suspense>
    </section>
  );
}
