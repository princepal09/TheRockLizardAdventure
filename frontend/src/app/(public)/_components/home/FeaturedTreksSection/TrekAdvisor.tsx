import { Compass, Map, MessageSquare } from "lucide-react";
import Link from "next/link";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampPhone } from "@/types/basecamp";

export default async function TrekAdvisor() {
  const settings = await getPublicSiteSettings().catch(() => null);
  const whatsapp = (settings?.whatsappPhone ?? settings?.contactPhone ?? basecampPhone).replace(
    /\D/g,
    "",
  );

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-[#fffefa] p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700">
          <Compass aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold">
            Looking for a custom duration or fitness calibration?
          </p>
          <p className="text-xs text-slate-600">
            Talk directly with the Almora Basecamp team via WhatsApp.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/${whatsapp}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
        >
          <MessageSquare aria-hidden="true" className="size-3.5" /> WhatsApp
          Trek Advisor
        </a>
        <Link
          href="/treks"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200"
        >
          <Map aria-hidden="true" className="size-3.5 text-orange-700" /> View
          All Treks
        </Link>
      </div>
    </div>
  );
}
