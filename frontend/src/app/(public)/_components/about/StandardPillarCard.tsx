import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

const tones = {
  sky: "bg-sky-100/80 text-sky-800",
  orange: "bg-orange-100/80 text-orange-800",
};

export default function StandardPillarCard({
  Icon,
  label,
  title,
  description,
  tags,
  tone,
  number,
  className,
}: {
  Icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  tags: readonly string[];
  tone: keyof typeof tones;
  number: number;
  className: string;
}) {
  const accent = tones[tone];

  return (
    <Card
      className={`min-w-0 gap-3 rounded-xl border border-stone-200 bg-[#fffefa] p-4 text-slate-900 shadow-sm ring-0! sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`grid size-9 place-items-center rounded-lg ${accent}`}>
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
        <p className="font-mono text-[10px] tracking-wide text-slate-600 uppercase">
          Pillar {String(number).padStart(2, "0")} · {label}
        </p>
      </div>
      <div>
        <h3 className="text-base font-bold tracking-tight sm:text-lg">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {tags.map((tag) => (
          <li
            key={tag}
            className={`rounded-md px-2 py-1 font-mono text-[9px] font-semibold tracking-wide uppercase ${accent}`}
          >
            {tag}
          </li>
        ))}
      </ul>
    </Card>
  );
}
