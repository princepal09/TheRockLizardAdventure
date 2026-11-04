import { Backpack, Download, Globe, Store, SquarePlay } from "lucide-react";

export default function SocialAndBrochureBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-800 py-10 ">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[10px] font-bold tracking-wide text-slate-200 uppercase">
          Follow our ridgelines
        </h2>
        <div aria-hidden="true" className="flex gap-1.5">
          {[Globe, SquarePlay, Backpack, Store].map((Icon, index) => (
            <span
              key={index}
              className="grid size-6 place-items-center rounded-full bg-slate-800 text-slate-200"
            >
              <Icon className="size-3" />
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-200 disabled:cursor-not-allowed"
      >
        <Download aria-hidden="true" className="size-3 text-sky-400" />
        Download 2026 B2B Tariff &amp; Brochure
      </button>
    </div>
  );
}
