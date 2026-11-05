import { Download } from "lucide-react";

import { declarationForm } from "@/lib/declaration-form";

export default function DeclarationFormDownload() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="max-w-xl">
        <h3 className="text-sm font-semibold text-slate-900">
          Declaration Form (Indemnity Bond)
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Read the indemnity bond and complete the participant details,
          emergency contact, signature and date fields. Confirm submission
          requirements with Basecamp before your departure.
        </p>
      </div>
      <a
        href={declarationForm.href}
        download={declarationForm.downloadName}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
      >
        <Download aria-hidden="true" className="size-4" />
        Download Declaration Form (PDF)
      </a>
    </div>
  );
}
