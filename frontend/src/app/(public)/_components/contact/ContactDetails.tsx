import { Headphones, Mail, MapPin, MessageSquare, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampAddress, basecampEmail, basecampPhone } from "@/types/basecamp";
import type { SiteSettings } from "@/types/site-settings";

export function ContactDetailsCard({ settings }: { settings?: SiteSettings | null }) {
  const phone = settings?.contactPhone ?? basecampPhone;
  const email = settings?.contactEmail ?? basecampEmail;
  const whatsapp = settings?.whatsappPhone ?? settings?.contactPhone ?? basecampPhone;
  const address = settings?.address ?? basecampAddress;
  const details = [
    {
      Icon: Phone,
      label: "Direct Dispatch Line",
      text: phone,
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
    },
    {
      Icon: MessageSquare,
      label: "WhatsApp Basecamp",
      text: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
    {
      Icon: Mail,
      label: "Expedition Enquiry Email",
      text: email,
      href: `mailto:${email}`,
    },
  ];

  return (
    <Card className="gap-3 rounded-xl border border-stone-200 bg-[#fffefa] p-4 text-slate-900 ring-0! sm:p-5">
      <div className="section-heading-accent">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Headphones aria-hidden="true" className="size-4 text-orange-700" /> Primary Dispatch
          Contacts
        </h2>
      </div>
      <div className="space-y-2">
        {details.map(({ Icon, label, text, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-start gap-2.5 rounded-lg bg-slate-100 p-3 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-700"
          >
            <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-700" />
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-wide text-slate-600 uppercase">
                {label}
              </span>
              <span className="mt-0.5 block text-sm font-bold break-all">{text}</span>
            </span>
          </a>
        ))}
        <address className="flex items-start gap-2.5 rounded-lg bg-slate-100 p-3 not-italic">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-orange-700" />
          <div>
            <p className="font-mono text-[10px] tracking-wide text-slate-600 uppercase">
              Physical Headquarters
            </p>
            <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {address}
            </p>
          </div>
        </address>
      </div>
    </Card>
  );
}

export default async function ContactDetails() {
  return <ContactDetailsCard settings={await getPublicSiteSettings().catch(() => null)} />;
}
