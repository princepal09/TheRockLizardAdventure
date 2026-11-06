"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "figure";
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
  ...props
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const Element = as === "section" ? motion.section : as === "figure" ? motion.figure : motion.div;

  return (
    <Element
      {...props}
      className={className}
      // Keep server-rendered content visible, including when JavaScript is unavailable.
      initial={false}
      whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1], y: [24, 0] }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -32px 0px" }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Element>
  );
}
