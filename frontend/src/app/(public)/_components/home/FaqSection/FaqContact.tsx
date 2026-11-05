import { Headphones, MessageSquare, Phone } from "lucide-react";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampPhone } from "@/types/basecamp";

export function FaqContactPanel({
  phone = basecampPhone,
  whatsapp = basecampPhone,
}: {
  phone?: string;
  whatsapp?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-[#fffefa] p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
          <Headphones aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold">Have a custom route or unanswered question?</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Speak directly with the Almora Basecamp team for trail advice.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-[#ffffff] hover:bg-orange-400"
        >
          <MessageSquare aria-hidden="true" className="size-3.5" /> Contact Basecamp
        </a>
        <a
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200"
        >
          <Phone aria-hidden="true" className="size-3.5 text-orange-700" /> {phone}
        </a>
      </div>
    </div>
  );
}

export default async function FaqContact() {
  const settings = await getPublicSiteSettings().catch(() => null);
  return (
    <FaqContactPanel
      phone={settings?.contactPhone ?? undefined}
      whatsapp={settings?.whatsappPhone ?? undefined}
    />
  );
}
