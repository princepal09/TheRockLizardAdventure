"use client";

import { Compass, Mountain, Route, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { TrekSearchItem } from "@/lib/api/published-treks";

import FeaturedTrekCard from "./FeaturedTrekCard";

const filters = [
  { label: "Recommended Treks", Icon: Star, levels: [] },
  { label: "Beginner & Easy Trails", Icon: Route, levels: ["EASY"] },
  { label: "Moderate Treks", Icon: Compass, levels: ["MODERATE"] },
  {
    label: "Challenging Treks",
    Icon: Mountain,
    levels: ["DIFFICULT", "VERY_DIFFICULT", "EXTREME"],
  },
];

export default function FeaturedTrekList({
  treks,
}: {
  treks: TrekSearchItem[];
}) {
  const [active, setActive] = useState(0);
  const { levels } = filters[active];
  const visible = (
    levels.length
      ? treks.filter((trek) => levels.includes(trek.difficulty))
      : treks
  ).slice(0, 3);

  return (
    <div className="mt-5">
      <div
        role="group"
        aria-label="Filter featured treks by difficulty"
        className="mb-5 flex flex-wrap gap-2"
      >
        {filters.map(({ label, Icon }, index) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className="h-auto rounded-lg border-stone-200 bg-white px-2.5 py-1.5 text-xs whitespace-normal aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-[#ffffff]"
          >
            <Icon aria-hidden="true" /> {label}
          </Button>
        ))}
      </div>
      {visible.length ? (
        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {visible.map((trek, index) => (
            <FeaturedTrekCard
              key={trek.id}
              trek={trek}
              highlighted={visible.length === 3 && index === 1}
            />
          ))}
        </div>
      ) : (
        <p role="status" className="py-5 text-sm text-slate-600">
          {treks.length
            ? "No featured treks at this difficulty."
            : "Featured treks will appear here once they’re published and marked as featured."}
        </p>
      )}
    </div>
  );
}
