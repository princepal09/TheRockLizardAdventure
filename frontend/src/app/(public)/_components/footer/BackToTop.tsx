"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export default function BackToTop() {
  const reduceMotion = useReducedMotion();
  const animate = reduceMotion === false;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-800 py-4 sm:py-5">
      <p className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
        Your next trail starts above
      </p>
      <motion.a
        href="#site-navigation"
        tabIndex={0}
        aria-label="Back to top and navigation"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
          document.getElementById("site-navigation")?.focus({ preventScroll: true });
        }}
        initial={false}
        whileHover={animate ? { y: -3 } : undefined}
        whileTap={animate ? { scale: 0.96 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-slate-600 py-1.5 pr-1.5 pl-4 text-xs font-semibold text-slate-100 hover:border-orange-400 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 sm:min-h-12"
      >
        Back to top
        <span className="grid size-8 place-items-center rounded-full bg-orange-600 text-white sm:size-9">
          <ArrowUp aria-hidden="true" className="size-4" />
        </span>
      </motion.a>
    </div>
  );
}
