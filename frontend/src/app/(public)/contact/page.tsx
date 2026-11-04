import type { Metadata } from "next";
import { Suspense } from "react";

import ContactDetails, {
  ContactDetailsCard,
} from "../_components/contact/ContactDetails";
import ContactForm from "../_components/contact/ContactForm";
import ContactHero from "../_components/contact/ContactHero";

export const metadata: Metadata = { title: "Contact Almora Basecamp" };

export default function ContactPage() {
  return (
    <main className="bg-[#f5f3ee] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 xl:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ContactHero />
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <ContactForm />
          <Suspense fallback={<ContactDetailsCard />}>
            <ContactDetails />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
