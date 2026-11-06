import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";

const monthFormat = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  timeZone: "UTC",
});

export default function TripSpecifications({ trip }: { trip: PublishedTripDetail }) {
  const monthName = (month: number) => monthFormat.format(new Date(Date.UTC(2026, month - 1, 1)));
  const windows = trip.seasons
    .map(({ season }) => {
      const months = [...new Set([season.startMonth, season.endMonth])]
        .filter((month): month is number => month != null && month >= 1 && month <= 12)
        .map(monthName);
      return months.length ? `${season.name} (${months.join("–")})` : season.name;
    })
    .join(", ");
  const months = trip.months?.map(({ month }) => monthName(month)).join(", ");
  const ages = [
    trip.minAge != null ? `${trip.minAge} minimum` : null,
    trip.maxAge != null ? `${trip.maxAge} maximum` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const specs = [
    ["Trip type", trip.tripType ? (trip.tripType === "BIKE" ? "Bike trip" : "Road trip") : null],
    ["Region", trip.region?.name],
    ["Start", trip.startingPoint],
    ["Finish", trip.endingPoint],
    ["Season windows", windows],
    ["Published months", months],
    ["Age range", ages],
    ["Maximum group size", trip.maxGroupSize?.toString()],
  ];

  return (
    <Card
      id="trip-specifications"
      className="scroll-mt-20 gap-4 border border-stone-200 bg-white p-5 text-slate-900 ring-0! sm:p-7"
    >
      <div>
        <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
          Full Specifications
        </p>
        <h2 className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {trip.tripType ? "Journey Details" : "Technical Dossier"}
        </h2>
      </div>
      {trip.description && (
        <p className="max-w-4xl whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {trip.description}
        </p>
      )}
      {trip.vehicleDetails && (
        <section className="rounded-xl bg-slate-100 p-4">
          <h3 className="text-sm font-bold">Vehicle & rider arrangements</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {trip.vehicleDetails}
          </p>
        </section>
      )}
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specs
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="border-l-2 border-orange-400 pl-3">
              <dt className="font-mono text-[10px] tracking-wide text-slate-600 uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold">{value}</dd>
            </div>
          ))}
      </dl>
    </Card>
  );
}
