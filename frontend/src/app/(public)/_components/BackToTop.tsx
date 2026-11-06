"use client";

import { ArrowUp } from "lucide-react";
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
      title="Back to top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
        document.getElementById("site-navigation")?.focus({ preventScroll: true });
      }}
      initial={false}
      whileHover={animate ? { y: -3 } : undefined}
      whileTap={animate ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed right-6 bottom-24 z-50 grid size-12 place-items-center rounded-full border border-orange-400 bg-orange-600 text-white shadow-lg transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-800"
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </motion.button>
  );
}
