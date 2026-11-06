import ScrollReveal from "../../ScrollReveal";
import { Map } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { founderName } from "@/types/founder";

import InquiryActions, { InquiryLinks } from "./InquiryActions";

export default function CustomInquiryBanner() {
  return (
    <ScrollReveal
      as="section"
      aria-labelledby="custom-inquiry-heading"
      className="relative isolate overflow-hidden rounded-2xl border border-slate-700 bg-[#121a2b] p-5 text-white shadow-lg sm:p-8 lg:p-10"
    >
      <Image
        src="/arrow.svg"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none -z-10 object-fill"
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/80 px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-sky-300 uppercase">
            <Map aria-hidden="true" className="size-3 shrink-0" /> Your own route &amp; itinerary
          </p>
          <h2
            id="custom-inquiry-heading"
            className="section-heading-accent mt-2 font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
          >
            Have a Different Destination in Mind?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Share your preferred destination, travel dates, trip length, group size and pace with{" "}
            {founderName} and the Almora team. We can plan a custom trek, expedition, road trip or
            bike journey around your ideas, including routes beyond the trips listed here.
          </p>
        </div>
        <Suspense fallback={<InquiryLinks />}>
          <InquiryActions />
        </Suspense>
      </div>
    </ScrollReveal>
  );
}
