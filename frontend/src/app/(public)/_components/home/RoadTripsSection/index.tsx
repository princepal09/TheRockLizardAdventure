import ScrollReveal from "../../ScrollReveal";
import { Suspense } from "react";
import Link from "next/link";
import { getPublishedRoadTrips } from "@/lib/api/published-road-trips";
import TrekCard from "../../treks/TrekCard";

async function RoadTripsContent() {
  const trips = await getPublishedRoadTrips().catch(() => null);
  if (!trips)
    return (
      <p role="alert" className="text-sm text-slate-600">
        Couldn’t load trips. Visit the Trips page to try again.
      </p>
    );
  const featured = [...trips]
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, 3);
  return featured.length ? (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((trip, index) => (
        <li key={trip.id}>
          <ScrollReveal delay={(index % 3) * 0.08}>
            <TrekCard kind="trips" trip={trip} />
          </ScrollReveal>
        </li>
      ))}
    </ul>
  ) : (
    <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
      Road and bike journeys will appear here when published. Contact Basecamp to plan a private
      trip.
    </p>
  );
}
export default function RoadTripsSection() {
  return (
    <section
      aria-labelledby="home-trips-title"
      className="space-y-6 bg-[#f2f7fa] px-4 py-10 text-slate-900 sm:px-6 xl:px-10"
    >
      <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-orange-800">
            Beyond the trail
          </p>
          <h2
            id="home-trips-title"
            className="section-heading-accent mt-2 font-heading text-3xl font-semibold sm:text-4xl"
          >
            Road & Bike Trips
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Find a new perspective on the open road. Explore routes, day-by-day plans and transport
            details for your next journey.
          </p>
        </div>
        <Link
          href="/trips"
          className="inline-flex min-h-11 items-center rounded-lg bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700"
        >
          Explore all trips →
        </Link>
      </ScrollReveal>
      <Suspense fallback={<p role="status">Loading road and bike trips…</p>}>
        <RoadTripsContent />
      </Suspense>
    </section>
  );
}
