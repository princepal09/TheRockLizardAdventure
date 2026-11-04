import { ArrowRight, Asterisk, ShieldCheck, Soup } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

const features = [
  {
    Icon: Asterisk,
    color: "bg-orange-400/15 text-orange-400",
    title: "Comprehensive Safety Cache",
    description:
      "Hyperbaric chamber readiness, pulse oximetry on trail, and dedicated descent routes.",
  },
  {
    Icon: Soup,
    color: "bg-sky-400/15 text-sky-400",
    title: "High-Stamina Pahadi Kitchen",
    description:
      "Fresh local grains such as mandua and gahat, cooked fresh twice daily above 10,000 feet.",
  },
];

export default function BasecampStory() {
  return (
    <Card className="relative isolate h-full gap-0 rounded-2xl border border-slate-700/50 bg-[#1b2636] p-5 text-white ring-0! lg:p-7">
      <ShieldCheck
        aria-hidden="true"
        className="pointer-events-none absolute top-5 right-5 -z-10 size-20 text-sky-400/10"
      />
      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-wide uppercase">
        <span className="rounded-full bg-orange-400/15 px-2.5 py-1 font-bold text-orange-400">
          Zero-incident record
        </span>
        <span className="text-slate-400">Est. Almora, Uttarakhand</span>
      </div>
      <h3 className="mt-4 max-w-lg text-xl leading-tight font-bold tracking-tight sm:text-2xl">
        Local mountain knowledge that cannot be outsourced.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        Rock Lizard Adventure is headquartered on Almora&apos;s Dharanaula
        ridge. Vinod&apos;s crew of high-altitude leads grew up crossing
        Pindari, Sunderdhunga, and Kafni passes.
      </p>
      <div className="mt-4 grid gap-4 border-t border-slate-700/70 pt-4 sm:grid-cols-2">
        {features.map(({ Icon, color, title, description }) => (
          <div key={title} className="flex items-start gap-2.5">
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-lg ${color}`}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{title}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/70 pt-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-700 font-mono text-xs font-bold text-sky-400"
            >
              VK
            </span>
            <div>
              <p className="text-xs font-bold">
                Vinod Chandra Bhatt &amp; Lead Expedition Crew
              </p>
              <p className="font-mono text-[10px] text-slate-400">
                Chief Operations Officer · Almora Basecamp
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-sky-300 hover:underline"
          >
            Meet the Crew <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
