import { Mail } from "lucide-react";

import { Card } from "@/components/ui/card";
import { basecampEmail, basecampPhone } from "@/types/basecamp";
import type { SiteSettings } from "@/types/site-settings";

import DossierIcon from "./DossierIcon";

const contactClass =
  "flex min-w-0 items-center gap-2.5 rounded-lg border border-white/5 bg-white/8 px-3 py-2.5 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-sky-300";

export default function CommandDesk({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const phone = settings?.contactPhone ?? basecampPhone;
  const email = settings?.contactEmail ?? basecampEmail;

  return (
    <Card className="min-w-0 gap-3 rounded-xl border border-slate-800 bg-[#101829] p-4 text-white shadow-sm ring-0! sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3 font-mono text-[10px] tracking-wide">
        <p className="font-bold text-orange-400 uppercase">Expeditions Desk</p>
        <span className="text-sky-200">Almora Basecamp</span>
      </div>
      <div>
        <h2 className="section-heading-accent max-w-[13rem] text-2xl leading-tight font-bold tracking-tight">
          Almora Operations Command
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
          Speak directly with the Basecamp team about this route and departure
          availability.
        </p>
      </div>
      <div className="space-y-2">
        <a
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          className={contactClass}
        >
          <DossierIcon name="metric-7" />
          <span className="min-w-0">
            <span className="block text-xs text-slate-400">
              Direct Expedition Hotline
            </span>
            <span className="block font-mono text-xs font-bold break-words">
              {phone}
            </span>
          </span>
        </a>
        <a href={`mailto:${email}`} className={contactClass}>
          <Mail aria-hidden="true" className="size-4 shrink-0 text-sky-200" />
          <span className="min-w-0">
            <span className="block text-xs text-slate-400">Email Basecamp</span>
            <span className="block font-mono text-xs font-bold break-all">
              {email}
            </span>
          </span>
        </a>
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-slate-700/80 pt-3 font-mono text-[10px] text-slate-400">
        <span>Almora, Uttarakhand</span>
        <a href="#trip-booking" className="text-sky-200 hover:underline">
          Check Availability
        </a>
      </div>
    </Card>
  );
}
