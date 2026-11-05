import { CalendarDays, Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublicListingTrip, TripKind } from "@/types/trip";
import type { Season } from "@/types/trip-option";

const accents = [
  { match: /autumn|fall/i, Icon: Leaf, color: "text-orange-700" },
  { match: /winter|snow/i, Icon: Snowflake, color: "text-sky-700" },
  { match: /spring/i, Icon: Flower2, color: "text-orange-700" },
  { match: /summer/i, Icon: Sun, color: "text-sky-700" },
];
const monthFormat = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  timeZone: "UTC",
});

export default function SeasonCard({
  season,
  routes,
  kind,
}: {
  season: Season;
  routes: Pick<PublicListingTrip, "id" | "name" | "slug">[];
  kind: TripKind;
}) {
  const { Icon, color } = accents.find(({ match }) => match.test(season.name)) ?? {
    Icon: CalendarDays,
    color: "text-sky-700",
  };
  const months = [...new Set([season.startMonth, season.endMonth])]
    .filter((month): month is number => month !== null && month >= 1 && month <= 12)
    .map((month) => monthFormat.format(new Date(Date.UTC(2000, month - 1, 1))));

  return (
    <Card className="gap-2 rounded-xl border border-stone-200 bg-[#fffefa] p-4 text-slate-900 ring-0!">
      <span className={`grid size-9 place-items-center rounded-lg bg-slate-100 ${color}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div>
        {months.length > 0 && (
          <p className={`font-mono text-[10px] font-bold tracking-widest uppercase ${color}`}>
            {months.join(" – ")}
          </p>
        )}
        <h3 className="mt-1 text-base font-semibold">{season.name}</h3>
      </div>
      {season.description && (
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600">
          {season.description}
        </p>
      )}
      {routes.length > 0 && (
        <div className="mt-auto border-t border-stone-100 pt-2">
          <p className="mb-1 font-mono text-[10px] font-bold tracking-wide text-slate-600 uppercase">
            Routes this season
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-sky-800">
            {routes.map(({ id, name, slug }) => (
              <li key={id}>
                <Link
                  href={`/${kind}/${encodeURIComponent(slug)}`}
                  prefetch={false}
                  className="hover:underline focus-visible:underline"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
