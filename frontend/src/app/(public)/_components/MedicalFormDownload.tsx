import { Download } from "lucide-react";

import { medicalForm } from "@/lib/medical-form";

export default function MedicalFormDownload() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="max-w-xl">
        <h3 className="text-sm font-semibold text-slate-900">
          Medical Fitness Certificate
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Download the form for completion by an MBBS/MD/MS doctor. Confirm
          submission requirements with Basecamp before your departure.
        </p>
      </div>
      <a
        href={medicalForm.href}
        download={medicalForm.downloadName}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
      >
        <Download aria-hidden="true" className="size-4" />
        Download Medical Form (PDF)
      </a>
    </div>
  );
}
