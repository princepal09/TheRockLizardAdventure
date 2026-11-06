import { pageMetadata } from "@/lib/page-metadata";
import { Suspense } from "react";
import { z } from "zod";
import { getPublishedRoadTrips } from "@/lib/api/published-road-trips";
import { getPublishedTreks } from "@/lib/api/published-treks";
import { getPublishedExpeditions } from "@/lib/api/published-expeditions";

import ContactDetails, { ContactDetailsCard } from "../_components/contact/ContactDetails";
import ContactForm from "../_components/contact/ContactForm";
import ContactHero from "../_components/contact/ContactHero";

export const metadata = pageMetadata(
  "Contact Almora Basecamp",
  "Contact the Rocklizard Adventure team in Almora for trek enquiries, expedition availability and private group planning.",
  "/contact",
);

type SearchParams = Promise<{
  topic?: string | string[];
  kind?: string | string[];
  trip?: string | string[];
}>;

async function EnquiryForm({ searchParams }: { searchParams: SearchParams }) {
  const { topic, kind, trip } = await searchParams;
  const collaboration = topic === "collaboration" || topic === "travel-trade";
  const customTrip = topic === "custom-trip";
  let selectedTrip: { value: string; name: string } | undefined;
  if (
    !customTrip &&
    (kind === "treks" || kind === "expeditions" || kind === "trips") &&
    typeof trip === "string" &&
    z.uuid().safeParse(trip).success
  ) {
    const trips = await (
      kind === "treks"
        ? getPublishedTreks()
        : kind === "trips"
          ? getPublishedRoadTrips()
          : getPublishedExpeditions()
    ).catch(() => []);
    const match = trips.find(({ id }) => id === trip);
    if (match) selectedTrip = { value: `${kind}:${match.id}`, name: match.name };
  }
  return (
    <ContactForm
      key={`${collaboration}:${customTrip}:${selectedTrip?.value ?? "general"}`}
      collaboration={collaboration}
      customTrip={customTrip}
      selectedTrip={selectedTrip}
    />
  );
}

export default function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="bg-[#f5f3ee] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ContactHero />
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <Suspense
            fallback={
              <div
                id="enquiry-form"
                role="status"
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-slate-600"
              >
                Loading enquiry form…
              </div>
            }
          >
            <EnquiryForm searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<ContactDetailsCard />}>
            <ContactDetails />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
