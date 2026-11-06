import ScrollReveal from "../../ScrollReveal";
import { Suspense } from "react";

import FaqAccordion from "./FaqAccordion";
import FaqContact, { FaqContactPanel } from "./FaqContact";

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-y border-sky-100 bg-[#eef5fa] px-4 py-10 text-slate-900 sm:px-6 sm:py-14"
    >
      <ScrollReveal className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-700 uppercase">
            Expedition intel
          </p>
          <h2
            id="faq-heading"
            className="section-heading-accent section-heading-accent--center mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Climber Field Notes &amp; High-Altitude FAQs
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Everything you need to prepare for acclimatization, meals, rental gear, and mountain
            emergencies.
          </p>
        </div>
        <FaqAccordion />
        <Suspense fallback={<FaqContactPanel />}>
          <FaqContact />
        </Suspense>
      </ScrollReveal>
    </section>
  );
}
