import { Mail, Phone } from "lucide-react";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampEmail, basecampPhone } from "@/types/basecamp";

export function ExpeditionContactLinks({
  phone = basecampPhone,
  email = basecampEmail,
}: {
  phone?: string;
  email?: string;
}) {
  const phoneNumber = phone.replace(/[^+\d]/g, "");

  return (
    <div className="flex flex-wrap items-center gap-2 md:shrink-0">
      <a
        href={`mailto:${email}?subject=Custom%20India%20Itinerary`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2.5 text-xs font-bold text-[#ffffff] transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
      >
        <Mail aria-hidden="true" className="size-3.5 shrink-0" /> Contact Us / Plan Custom Route
      </a>
      <a
        href={`tel:${phoneNumber}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <Phone aria-hidden="true" className="size-3.5 shrink-0 text-orange-700" /> {phone}
      </a>
    </div>
  );
}

export default async function CustomExpeditionActions() {
  const settings = await getPublicSiteSettings().catch(() => null);
  return (
    <ExpeditionContactLinks
      phone={settings?.contactPhone ?? undefined}
      email={settings?.contactEmail ?? undefined}
    />
  );
}
