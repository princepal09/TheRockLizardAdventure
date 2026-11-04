import { Mountain, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { tripDifficulties, type PublicListingTrip } from "@/types/trip";

export const defaultFilters = {
  region: "",
  grade: "",
  duration: "",
  season: "",
  basecamp: "",
  sort: "recommended",
};
export type TripFilters = typeof defaultFilters;
type Option = readonly [value: string, label: string];

export default function TrekFilterToolbar({
  trips,
  filters,
  onChange,
  count,
  query,
  onReset,
}: {
  trips: PublicListingTrip[];
  filters: TripFilters;
  onChange: (filters: TripFilters) => void;
  count: number;
  query: string;
  onReset: () => void;
}) {
  const regions = new Map<string, string>();
  const seasons = new Map<string, string>();
  const basecamps = new Set<string>();
  const durations = new Set<number>();
  const grades = new Set(trips.map(({ difficulty }) => difficulty));
  for (const trip of trips) {
    if (trip.region?.name) regions.set(trip.regionId, trip.region.name);
    for (const { seasonId, season } of trip.seasons ?? []) {
      if (season?.name) seasons.set(seasonId, season.name);
    }
    if (trip.startingPoint) basecamps.add(trip.startingPoint);
    durations.add(trip.durationDays);
  }

  const fields: {
    key: Exclude<keyof TripFilters, "region">;
    label: string;
    options: Option[];
  }[] = [
    {
      key: "grade",
      label: "Trail Grade",
      options: [
        ["", "All Grades"],
        ...tripDifficulties
          .filter((grade) => grades.has(grade))
          .map(
            (grade) =>
              [grade, grade.toLowerCase().replaceAll("_", " ")] as const,
          ),
      ],
    },
    {
      key: "duration",
      label: "Duration Window",
      options: [
        ["", "All Durations"],
        ...Array.from(durations)
          .sort((a, b) => a - b)
          .map(
            (days) =>
              [String(days), `${days} ${days === 1 ? "day" : "days"}`] as const,
          ),
      ],
    },
    {
      key: "season",
      label: "Season Window",
      options: [["", "All Seasons"], ...seasons],
    },
    {
      key: "basecamp",
      label: "Assembly Basecamp",
      options: [
        ["", "All Departure Hubs"],
        ...Array.from(basecamps)
          .sort()
          .map((place) => [place, place] as const),
      ],
    },
    {
      key: "sort",
      label: "Sort Trails By",
      options: [
        ["recommended", "Recommended Routes"],
        ["shortest", "Shortest First"],
        ["highest", "Highest Altitude"],
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Filter by region"
        className="flex flex-wrap justify-center gap-2"
      >
        {[["", `All Trails (${trips.length})`], ...regions].map(
          ([id, label]) => (
            <Button
              key={id}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={filters.region === id}
              onClick={() => onChange({ ...filters, region: id })}
              className="rounded-full border-slate-200 bg-white px-3 aria-pressed:border-orange-500 aria-pressed:bg-orange-500 aria-pressed:text-slate-950"
            >
              {id && <Mountain aria-hidden="true" />}
              {label}
            </Button>
          ),
        )}
      </div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-5">
        {fields.map(({ key, label, options }) => (
          <label
            key={key}
            className="min-w-0 space-y-1 text-xs font-medium text-slate-600"
          >
            <span>{label}</span>
            <select
              value={filters[key]}
              onChange={(event) =>
                onChange({ ...filters, [key]: event.target.value })
              }
              className="block w-full rounded-lg border border-transparent bg-slate-100 px-2.5 py-2 text-sm text-slate-900 capitalize focus-visible:outline-2 focus-visible:outline-sky-700"
            >
              {options.map(([value, title]) => (
                <option key={value} value={value}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <p role="status">
          Showing{" "}
          <strong className="text-slate-900">
            {count} {count === 1 ? "route" : "routes"}
          </strong>
          {query && <> matching “{query}”</>}.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 font-semibold text-orange-800 hover:underline"
        >
          <RotateCcw aria-hidden="true" className="size-3" /> Reset Filters
        </button>
      </div>
    </div>
  );
}
