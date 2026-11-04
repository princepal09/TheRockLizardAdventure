import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { getPublishedTripDetail } from "@/lib/api/published-trip-detail";
import type { TripKind } from "@/types/trip";

import DossierHero from "./DossierHero";
import DossierReveal from "./DossierReveal";
import TripBooking from "./TripBooking";
import TripGallery from "./TripGallery";
import TripItinerary from "./TripItinerary";
import TripProfile from "./TripProfile";
import TripSpecifications from "./TripSpecifications";

type Props = { kind: TripKind; params: Promise<{ slug: string }> };

async function TripDossier({ kind, params }: Props) {
  const { slug } = await params;
  const [trip, settings] = await Promise.all([
    getPublishedTripDetail(kind, slug).catch(() => undefined),
    getPublicSiteSettings().catch(() => null),
  ]);
  if (trip === undefined)
    return (
      <p role="alert" className="p-8 text-slate-700">
        Couldn’t load this route. Refresh to try again.
      </p>
    );
  if (!trip) notFound();

  const links = [
    { id: "trip-overview", label: "Overview" },
    { id: "trip-specifications", label: "Expedition Dossier" },
    ...(trip.itineraries.length
      ? [{ id: "trip-itinerary", label: "Acclimatization & Camps" }]
      : []),
    { id: "trip-booking", label: "Tariff & Booking" },
    ...(trip.images.length
      ? [{ id: "trip-gallery", label: "Photo Gallery" }]
      : []),
  ];

  return (
    <>
      <DossierHero trip={trip} kind={kind} />
      <nav
        aria-label="On this page"
        className="border-b border-orange-700 bg-orange-600 text-white"
      >
        <ul className="mx-auto flex max-w-screen-2xl items-center gap-2 overflow-x-auto px-4 py-2 text-xs font-semibold whitespace-nowrap sm:px-6 xl:px-10">
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`inline-flex rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-950 ${id === "trip-overview" ? "bg-white text-orange-800" : "hover:bg-orange-700"}`}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="ml-auto">
            <a
              href="#trip-booking"
              className="inline-flex rounded-full bg-slate-900 px-3 py-1.5 font-mono text-[10px] text-white hover:bg-slate-800"
            >
              Check Availability
            </a>
          </li>
        </ul>
      </nav>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <DossierReveal>
          <TripProfile trip={trip} settings={settings} />
        </DossierReveal>
        {trip.images.length > 0 && (
          <DossierReveal>
            <TripGallery images={trip.images} />
          </DossierReveal>
        )}
        <DossierReveal>
          <TripSpecifications trip={trip} />
        </DossierReveal>
        {trip.itineraries.length > 0 && (
          <DossierReveal>
            <TripItinerary itinerary={trip.itineraries} />
          </DossierReveal>
        )}
        <DossierReveal>
          <TripBooking trip={trip} settings={settings} />
        </DossierReveal>
      </div>
    </>
  );
}

function DossierSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading route dossier…</span>
      <div aria-hidden="true">
        <div className="flex min-h-[clamp(25rem,38vw,34rem)] flex-col justify-center gap-4 bg-slate-900 px-4 py-8 sm:px-6 xl:px-10">
          <Skeleton className="h-16 w-full max-w-3xl bg-slate-700" />
          <Skeleton className="h-8 w-3/4 max-w-xl bg-slate-700" />
          <div className="mt-4 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 bg-slate-700" />
            ))}
          </div>
        </div>
        <div className="h-11 bg-orange-600" />
        <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[2fr_1fr] xl:px-10">
          <Skeleton className="h-64 bg-stone-200" />
          <Skeleton className="h-64 bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function TripDetailPage(props: Props) {
  return (
    <main className="bg-[#f5f3ee] text-slate-900">
      <Suspense fallback={<DossierSkeleton />}>
        <TripDossier {...props} />
      </Suspense>
    </main>
  );
}
