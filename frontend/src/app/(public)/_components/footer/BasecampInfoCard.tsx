import { Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";

import { basecampAddress, basecampEmail, basecampPhone } from "../../../../types/basecamp";

export default function BasecampInfoCard({ settings }: { settings: SiteSettings | null }) {
  const phone = settings?.contactPhone ?? basecampPhone;
  const email = settings?.contactEmail ?? basecampEmail;
  const whatsapp = settings?.whatsappPhone ?? settings?.contactPhone ?? basecampPhone;
  return (
    <section className="min-w-0 rounded-2xl border border-slate-700/70 bg-[#1b2636] p-3 shadow-lg shadow-slate-950/20 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/70 pb-2">
        <h2 className="text-sm font-bold text-white">Rock Lizard Almora Basecamp</h2>
        <span className="rounded-full bg-orange-500/15 px-2 py-1 font-mono text-[9px] font-bold tracking-wide text-orange-300 uppercase">
          Official headquarters
        </span>
      </div>
      <address className="space-y-2 py-2 text-[11px] leading-snug text-slate-300 not-italic">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-800">
            <MapPin aria-hidden="true" className="size-3.5 text-orange-400" />
          </span>
          <p>{settings?.address ?? basecampAddress}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline"
          >
            <Phone aria-hidden="true" className="size-3 text-orange-400" />
            {settings?.contactPhone ?? "+91 9410482131"}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-white hover:underline"
          >
            <Mail aria-hidden="true" className="size-3 shrink-0 text-orange-400" />
            <span className="break-all">{email}</span>
          </a>
        </div>
      </address>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-700/70 pt-2 font-mono text-[9px] text-slate-400">
        <span>Mon–Sat: 09:00–21:00 (IST)</span>
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          className="inline-flex items-center gap-1.5 text-slate-200 hover:underline"
        >
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
          WhatsApp Support Online ({whatsapp})
        </a>
      </div>
    </section>
  );
}
