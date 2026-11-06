"use client";

import { Pause, Play } from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useState } from "react";

import ScrollReveal from "../../ScrollReveal";
import styles from "./affiliations.module.css";

const affiliations = [
  {
    name: "Uttarakhand Tourism",
    image: "/affiliation/uttarakhand_tourims.jpg",
    width: 216,
    height: 75,
  },
  {
    name: "Indian Mountaineering Foundation",
    image: "/affiliation/indian_moutanieering_foundation.png",
    width: 321,
    height: 123,
  },
];

// Fill a full desktop viewport before the identical second group loops into view.
const logos = Array.from({ length: 2 }, () => affiliations).flat();

export default function AffiliationsSection() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const progress = useMotionValue(0);
  const x = useTransform(progress, (value) => `${value}%`);

  useAnimationFrame((_, delta) => {
    if (reducedMotion || paused || hovered) return;
    // Two equal groups make a 50% translation a seamless loop. Cap long frame gaps.
    const next = progress.get() - (Math.min(delta, 64) / 50000) * 50;
    progress.set(next <= -50 ? next + 50 : next);
  });

  return (
    <section
      aria-labelledby="affiliations-heading"
      className="border-b border-slate-200 bg-white px-4 py-10 text-slate-900 sm:px-6 sm:py-12 xl:px-10"
    >
      <ScrollReveal className="mx-auto max-w-screen-2xl">
        <div className="mb-7 text-center">
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            Connected to the outdoors
          </p>
          <h2
            id="affiliations-heading"
            className="section-heading-accent section-heading-accent--center mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Our Affiliations
          </h2>
        </div>
        <div
          className={styles.viewport}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div className={styles.track} style={{ x: reducedMotion ? 0 : x }}>
            {[0, 1].map((group) => (
              <ul
                key={group}
                aria-label={group === 0 ? "Affiliated organizations" : undefined}
                aria-hidden={group === 1 ? true : undefined}
                className={`${styles.group} ${group === 1 ? styles.duplicate : ""}`}
              >
                {logos.map(({ name, image, width, height }, index) => {
                  const duplicate = group === 1 || index >= affiliations.length;
                  return (
                    <li
                      key={`${name}-${index}`}
                      aria-hidden={duplicate ? true : undefined}
                      className={`${styles.logo} ${index >= affiliations.length ? styles.duplicate : ""}`}
                    >
                      <Image
                        src={image}
                        alt={duplicate ? "" : name}
                        width={width}
                        height={height}
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 40vw, 50vw"
                        className="h-20 w-full object-contain sm:h-24"
                      />
                    </li>
                  );
                })}
              </ul>
            ))}
          </motion.div>
        </div>
        <div className={`${styles.controls} mt-4 flex justify-center`}>
          <button
            type="button"
            aria-label={paused ? "Resume affiliation scrolling" : "Pause affiliation scrolling"}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {paused ? (
              <Play aria-hidden="true" className="size-3.5" />
            ) : (
              <Pause aria-hidden="true" className="size-3.5" />
            )}
            {paused ? "Resume scrolling" : "Pause scrolling"}
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
