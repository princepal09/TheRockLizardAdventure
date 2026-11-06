import ScrollReveal from "../../ScrollReveal";
import { Map } from "lucide-react";
import { Suspense } from "react";
import { founderName } from "@/types/founder";

import CustomExpeditionActions, { ExpeditionContactLinks } from "./CustomExpeditionActions";

export default function CustomExpeditionsBanner() {
  return (
    <section
      aria-labelledby="custom-expeditions-title"
      className="bg-[#f5f3ee] px-4 py-6 text-slate-900 sm:px-6 xl:px-10"
    >
      <ScrollReveal className="flex flex-col gap-4 rounded-xl border border-sky-200 bg-[#e7f2f8] p-4 sm:p-5 md:flex-row md:items-center md:justify-between lg:px-6">
        <div className="min-w-0 max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2 py-1 font-mono text-[9px] font-bold tracking-widest text-orange-800 uppercase">
            <Map aria-hidden="true" className="size-3 shrink-0" /> Custom treks, expeditions &amp;
            trips
          </p>
          <h2
            id="custom-expeditions-title"
            className="section-heading-accent mt-2 text-xl leading-tight font-extrabold tracking-tight sm:text-2xl"
          >
            Your Destination. Your Dates. Your Kind of Trip.
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Have a destination in mind beyond our listed routes? Tell us where you want to go, your
            preferred dates, duration and group size. We’ll work with you on a custom trek,
            expedition, road trip or bike journey that suits your interests and pace.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Plan with {founderName} and the Almora team for journeys across Uttarakhand (Kumaon +
            Garhwal), Kashmir and Maharashtra. Share your idea and let’s explore the route together.
          </p>
        </div>
        <Suspense fallback={<ExpeditionContactLinks />}>
          <CustomExpeditionActions />
        </Suspense>
      </ScrollReveal>
    </section>
  );
}
