"use client";

import { Mountain, Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { TrekSearchItem } from "@/lib/api/published-treks";

import TripPhoto from "../../trip-detail/TripPhoto";

type GalleryTrek = Pick<TrekSearchItem, "id" | "name" | "slug" | "coverImageUrl">;
const controlClass =
  "z-20 size-9 border-stone-200 bg-white text-slate-900 shadow-sm hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-sky-700";

function TrekCard({ trek }: { trek: GalleryTrek }) {
  return (
    <Link
      href={`/treks/${encodeURIComponent(trek.slug)}`}
      prefetch={false}
      className="group relative isolate flex aspect-[1.15] items-end overflow-hidden rounded-xl bg-slate-800 p-3 text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
    >
      <TripPhoto
        key={trek.coverImageUrl}
        src={trek.coverImageUrl}
        alt=""
        sizes="(min-width: 768px) 20vw, 50vw"
        className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
        fallback={
          <Mountain
            aria-hidden="true"
            className="absolute top-1/3 left-1/2 size-8 -translate-x-1/2 text-slate-400"
          />
        }
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/25 to-transparent"
      />
      <span className="relative text-sm leading-snug font-semibold">{trek.name}</span>
    </Link>
  );
}

export default function RegionCarousel({ treks }: { treks: GalleryTrek[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const reduceMotion = useReducedMotion();
  const [overflow, setOverflow] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const updateOverflow = () => setOverflow(api.scrollSnapList().length > 1);
    updateOverflow();
    api.on("reInit", updateOverflow);
    return () => {
      api.off("reInit", updateOverflow);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !overflow || paused || hovered || focused || reduceMotion !== false) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [api, overflow, paused, hovered, focused, reduceMotion]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0.85 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <Carousel
        aria-label="Published treks"
        className="max-w-[90rem]"
        opts={{
          align: "start",
          loop: true,
          breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2.5!">
          {treks.map((trek) => (
            <CarouselItem key={trek.id} className="basis-1/2! pl-2.5! sm:basis-1/3! md:basis-1/5!">
              <TrekCard trek={trek} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {overflow && (
          <>
            <CarouselPrevious
              size="icon-lg"
              className={`${controlClass} -left-2.5!`}
              disabled={false}
              onClick={() => {
                if (api?.canScrollPrev()) api.scrollPrev();
                else if (api) api.scrollTo(api.scrollSnapList().length - 1);
              }}
            />
            <CarouselNext
              size="icon-lg"
              className={`${controlClass} -right-2.5!`}
              disabled={false}
              onClick={() => {
                if (api?.canScrollNext()) api.scrollNext();
                else api?.scrollTo(0);
              }}
            />
          </>
        )}
      </Carousel>
      {overflow && reduceMotion === false && (
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play carousel" : "Pause carousel"}
          className="mt-2 ml-auto grid size-7 place-items-center rounded-full text-slate-600 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-sky-700"
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3.5" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5" />
          )}
        </button>
      )}
    </motion.div>
  );
}
