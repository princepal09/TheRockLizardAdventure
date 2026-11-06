import ScrollReveal from "../ScrollReveal";
import { Phone } from "lucide-react";
import Link from "next/link";

import { basecampPhone } from "../../../../types/basecamp";

export default function CtaBanner({ phone }: { phone?: string | null }) {
  const contactPhone = phone ?? basecampPhone;
  return (
    <ScrollReveal as="section" className="border-b-2 border-sky-500 bg-[#101727]">
      <div className="flex w-full flex-col gap-3 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between xl:px-10">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-widest text-orange-400 uppercase">
            Custom trips &amp; school camps
          </p>
          <h2 className="mt-1 max-w-sm text-xl leading-tight font-extrabold tracking-tight text-white sm:text-2xl">
            Ready to explore your next trail in India?
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-300">
            Plan your next adventure in Uttarakhand (Kumaon + Garhwal), Kashmir or Maharashtra with
            our Almora Basecamp team.
          </p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-300">
            Have another destination in mind? Ask us to customize your route, dates and itinerary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <Link
            href="/contact?topic=custom-trip#enquiry-form"
            className="inline-flex min-h-11 w-fit items-center rounded-lg border border-sky-400/40 bg-sky-400/10 px-4 py-2.5 text-xs font-bold text-sky-200 hover:bg-sky-400/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          >
            Customize Your Trip
          </Link>
          <a
            href={`tel:${contactPhone}`}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-[#ffffff] hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            <Phone aria-hidden="true" className="size-3.5" />
            Call Basecamp ({contactPhone})
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
}
