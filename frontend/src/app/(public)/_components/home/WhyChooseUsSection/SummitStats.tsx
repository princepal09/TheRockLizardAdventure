import { Footprints, MapPin, Repeat2, Star } from "lucide-react";

import { Card } from "@/components/ui/card";

import SectionReveal from "./SectionReveal";

const stats = [
  {
    Icon: Footprints,
    value: "5,000+",
    label: "Summiteers Guided",
    description: "Across Kumaon glacier trails and high ridges.",
    color: "bg-sky-400/10 text-sky-400",
    border: "border-sky-400/15",
  },
  {
    Icon: Star,
    value: "5.0 ★",
    label: "Verified Google Rating",
    description: "150+ authentic, unedited climber dispatches.",
    color: "bg-blue-400/10 text-sky-400",
    border: "border-transparent",
  },
  {
    Icon: MapPin,
    value: "12+ Yrs",
    label: "In Almora Basecamp",
    description: "Zero safety compromises since inception.",
    color: "bg-sky-400/10 text-sky-400",
    border: "border-sky-400/15",
  },
  {
    Icon: Repeat2,
    value: "92%",
    label: "Repeat & Referral",
    description: "Eco-drives and returning mountaineers.",
    color: "bg-amber-400/10 text-amber-400",
    border: "border-transparent",
  },
];

export default function SummitStats() {
  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-3">
      {stats.map(
        ({ Icon, value, label, description, color, border }, index) => (
          <SectionReveal
            key={label}
            className="min-w-0"
            delay={0.09 + index * 0.04}
          >
            <Card
              className={`h-full min-h-36 justify-between gap-5 rounded-xl border bg-[#182233] p-3.5 text-white ring-0! sm:p-4 ${border}`}
            >
              <span
                className={`grid size-8 place-items-center rounded-lg ${color}`}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="mb-1 font-mono text-xl leading-none font-bold text-white sm:text-2xl">
                  {value}
                </p>
                <h3 className="text-xs font-semibold text-slate-100">
                  {label}
                </h3>
                <p className="mt-1 text-xs leading-snug text-slate-400">
                  {description}
                </p>
              </div>
            </Card>
          </SectionReveal>
        ),
      )}
    </div>
  );
}
