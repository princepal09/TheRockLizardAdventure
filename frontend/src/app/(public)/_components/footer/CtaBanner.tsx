import { Phone } from "lucide-react";

import { basecampPhone } from "../../../../types/basecamp";

export default function CtaBanner() {
  return (
    <section className="border-b-2 border-sky-500 bg-[#101727]">
      <div className="flex w-full flex-col gap-3 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between xl:px-10">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-widest text-orange-400 uppercase">
            Custom expeditions &amp; school camps
          </p>
          <h2 className="mt-1 max-w-sm text-xl leading-tight font-extrabold tracking-tight text-white sm:text-2xl">
            Ready to explore the authentic Kumaon Himalayas?
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-300">
            Speak directly with Vinod&apos;s expedition operations desk in
            Almora to tailor your high-altitude itinerary.
          </p>
        </div>
        <a
          href={`tel:${basecampPhone}`}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
        >
          <Phone aria-hidden="true" className="size-3.5" />
          Call Basecamp ({basecampPhone})
        </a>
      </div>
    </section>
  );
}
