import { tripEnquiryHref } from "@/lib/trip-enquiry";
import type { TripKind } from "@/types/trip";
import DossierIcon from "./DossierIcon";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";
import type { SiteSettings } from "@/types/site-settings";
import { basecampPhone } from "@/types/basecamp";
import { formatTripPrice } from "@/types/format-trip-price";
import MedicalFormDownload from "../MedicalFormDownload";
import DeclarationFormDownload from "../DeclarationFormDownload";
import BookingPolicyDownloads from "../BookingPolicyDownloads";

export default function TripBooking({
  trip,
  kind,
  settings,
}: {
  trip: PublishedTripDetail;
  kind: TripKind;
  settings: SiteSettings | null;
}) {
  const phone = settings?.contactPhone ?? basecampPhone;
  const whatsapp = (settings?.whatsappPhone ?? settings?.contactPhone ?? basecampPhone).replace(
    /\D/g,
    "",
  );
  const message = encodeURIComponent(
    `Hi Rock Lizard Adventure, could you share availability for ${trip.name}?`,
  );
  const price = formatTripPrice(trip);
  const standardPrice =
    trip.discountPrice != null ? formatTripPrice({ ...trip, discountPrice: null }) : null;

  return (
    <Card
      id="trip-booking"
      className="scroll-mt-20 gap-4 border border-stone-200 bg-white p-5 text-slate-900 ring-0! sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">
            {kind === "trips" ? "Talk to Your Trip Coordinator" : "Direct Mountaineer Consultation"}
          </p>
          <h2 className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Plan Your Departure with Almora HQ
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Contact Basecamp to confirm dates, availability, and trip requirements.
          </p>
        </div>
        {price && (
          <p className="font-mono text-xl font-bold">
            {price}
            {standardPrice && standardPrice !== price && (
              <del className="ml-2 text-sm font-normal text-slate-600">{standardPrice}</del>
            )}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={tripEnquiryHref(kind, trip.id)}
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-[#ffffff] hover:bg-orange-400"
        >
          Book Now
        </Link>
        <a
          href={`https://wa.me/${whatsapp}?text=${message}`}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
        >
          <DossierIcon name="contact-0" /> WhatsApp Basecamp
        </a>
        <a
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-800"
        >
          <DossierIcon name="contact-1" /> Call Basecamp
        </a>
      </div>
      <BookingPolicyDownloads />
      <MedicalFormDownload />
      <DeclarationFormDownload />
    </Card>
  );
}
