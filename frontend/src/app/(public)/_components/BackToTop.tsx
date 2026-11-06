"use client";

import { ChevronUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const pathname = usePathname();
  const [visibleOnPage, setVisibleOnPage] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const animate = reduceMotion === false;

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      // Measure the current route's hero, including content streamed in after navigation.
      const hero = document.querySelector("main section");
      const headerHeight =
        document.getElementById("site-navigation")?.getBoundingClientRect().height ?? 0;
      const pastHero = hero
        ? hero.getBoundingClientRect().bottom <= headerHeight
        : window.scrollY > window.innerHeight * 0.6;
      setVisibleOnPage(window.scrollY > 0 && pastHero ? pathname : null);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateVisibility);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  if (visibleOnPage !== pathname) return null;

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
        document.getElementById("site-navigation")?.focus({ preventScroll: true });
      }}
      initial={animate ? { opacity: 0, y: 12, scale: 0.9 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={animate ? { y: -4, scale: 1.06 } : undefined}
      whileTap={animate ? { scale: 0.94 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group fixed right-[34px] bottom-[184px] z-50 grid size-11 cursor-pointer place-items-center rounded-full border border-white/80 bg-orange-600 text-white shadow-[0_5px_14px_-4px_#ea580c40] transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
    >
      <ChevronUp
        aria-hidden="true"
        strokeWidth={2.5}
        className="size-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[calc(100%+0.75rem)] whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:translate-x-1 motion-safe:transition-all motion-safe:duration-200 motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0"
      >
        Back to top
      </span>
    </motion.button>
  );
}
