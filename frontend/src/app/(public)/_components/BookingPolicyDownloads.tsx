import PolicyLink from "@/components/PolicyLink";
import { FileText } from "lucide-react";

import { cancellationRefundPolicy, termsAndConditions } from "@/lib/booking-policies";

export default function BookingPolicyDownloads() {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs leading-relaxed text-slate-600">
        Before confirming a booking, review our policies alongside your trip details.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {[termsAndConditions, cancellationRefundPolicy].map((document) => (
          <PolicyLink
            key={document.id}
            policy={document.id}
            className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-orange-800 underline underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
          >
            <FileText aria-hidden="true" className="size-3.5 shrink-0" />
            {document.title}
          </PolicyLink>
        ))}
      </div>
    </div>
  );
}
