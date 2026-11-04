import { Map } from "lucide-react";
import { Suspense } from "react";

import CustomExpeditionActions, {
  ExpeditionContactLinks,
} from "./CustomExpeditionActions";

export default function CustomExpeditionsBanner() {
  return (
    <section
      aria-labelledby="custom-expeditions-title"
      className="bg-[#f5f3ee] px-4 py-6 text-slate-900 sm:px-6 xl:px-10"
    >
      <div className="flex flex-col gap-4 rounded-xl border border-sky-200 bg-[#e7f2f8] p-4 sm:p-5 md:flex-row md:items-center md:justify-between lg:px-6">
        <div className="min-w-0 max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2 py-1 font-mono text-[9px] font-bold tracking-widest text-orange-800 uppercase">
            <Map aria-hidden="true" className="size-3 shrink-0" /> Custom
            expeditions &amp; private groups
          </p>
          <h2
            id="custom-expeditions-title"
            className="mt-2 text-xl leading-tight font-extrabold tracking-tight sm:text-2xl"
          >
            Planning a Custom Kumaon Route or Need Private Guidance?
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Consult Vinod Kumar directly for tailored departure dates, bespoke
            family or school itineraries, corporate expeditions, or alpine
            difficulty calibration across high Kumaon passes.
          </p>
        </div>
        <Suspense fallback={<ExpeditionContactLinks />}>
          <CustomExpeditionActions />
        </Suspense>
      </div>
    </section>
  );
}
