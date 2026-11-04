import type { Metadata } from "next";
import { Suspense } from "react";

import ContactDetails, {
  ContactDetailsCard,
} from "../_components/contact/ContactDetails";
import ContactForm from "../_components/contact/ContactForm";
import ContactHero from "../_components/contact/ContactHero";

export const metadata: Metadata = { title: "Contact Almora Basecamp" };

type SearchParams = Promise<{ topic?: string | string[] }>;

async function EnquiryForm({ searchParams }: { searchParams: SearchParams }) {
  const { topic } = await searchParams;
  const travelTrade = topic === "travel-trade";
  return <ContactForm key={String(travelTrade)} travelTrade={travelTrade} />;
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
