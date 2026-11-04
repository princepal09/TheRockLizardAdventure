"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function HeroEntrance({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative z-10 px-5 pt-6 pb-16 sm:px-[6.55%] sm:pt-[2.1%]"
      initial={reduceMotion ? false : { opacity: 0.85, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
