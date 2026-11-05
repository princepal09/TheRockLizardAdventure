import { CalendarDays, Phone } from "lucide-react";
import Link from "next/link";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampPhone } from "@/types/basecamp";

export function InquiryLinks({ phone = basecampPhone }: { phone?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
      {/* <a
        href={`tel:${phone.replace(/[^+\d]/g, "")}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Phone aria-hidden="true" className="size-3.5 shrink-0" /> Call Basecamp
        ({phone})
      </a> */}
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <CalendarDays className="h-4 w-4 text-[#ff5722]" />
        Book now
      </Link>
    </div>
  );
}

export default async function InquiryActions() {
  const settings = await getPublicSiteSettings().catch(() => null);
  return <InquiryLinks phone={settings?.contactPhone ?? undefined} />;
}
