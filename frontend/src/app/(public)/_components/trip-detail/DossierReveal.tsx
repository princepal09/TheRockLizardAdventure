"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function DossierReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0.85, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
