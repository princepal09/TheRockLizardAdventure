import { CalendarDays } from "lucide-react";
import Link from "next/link";

export function InquiryLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
      <Link
        href="/contact?topic=custom-trip#enquiry-form"
        className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <CalendarDays className="h-4 w-4 text-[#ff5722]" />
        Customize Your Trip
      </Link>
    </div>
  );
}

export default function InquiryActions() {
  return <InquiryLinks />;
}
