"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const display = useTransform(count, (current) => formatter.format(current));

  useEffect(() => {
    if (!inView) return;
    const animation = animate(count, value, {
      duration: reducedMotion ? 0 : 1.8,
      ease: "easeOut",
    });
    return () => animation.stop();
  }, [count, inView, reducedMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">
        {formatter.format(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        <motion.span>{display}</motion.span>
        {suffix}
      </span>
    </span>
  );
}
