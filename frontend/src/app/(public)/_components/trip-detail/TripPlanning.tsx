import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Card } from "@/components/ui/card";
import type { PublishedTripDetail } from "@/lib/api/published-trip-detail";
import { tripEnquiryHref } from "@/lib/trip-enquiry";
import { cancellationRefundPolicy } from "@/lib/booking-policies";
import type { TripKind } from "@/types/trip";

export default async function TripPlanning({ trip, kind }: { trip: PublishedTripDetail; kind: TripKind }) {
  // Upcoming dates depend on today's date, so evaluate them at request time.
  await connection();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const departures = [...new Set((trip.departureDates ?? "").split(/\r?\n/).map((date) => date.trim()).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today && Number.isFinite(Date.parse(date))))].sort();
  const sections = [
    { title: "Price includes", value: trip.inclusions, list: true, fallback: "Ask Basecamp for the confirmed inclusions for this departure." },
    { title: "Price excludes", value: trip.exclusions, list: true, fallback: "Confirm additional costs, permits, transport and personal expenses with Basecamp." },
    { title: "Required gear", value: trip.requiredGear, list: true, fallback: "Request the route-specific gear list and confirm rental availability before departure." },
    { title: "Cancellation terms", value: trip.cancellationPolicy, fallback: <>Read our <a href={cancellationRefundPolicy.href} download={cancellationRefundPolicy.downloadName} className="font-semibold text-orange-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Cancellation &amp; Refund Policy (PDF)</a> and confirm any booking-specific terms with Basecamp.</> },
    { title: "Refund terms", value: trip.refundPolicy, fallback: <>Review refund eligibility and the request process in our <a href={cancellationRefundPolicy.href} download={cancellationRefundPolicy.downloadName} className="font-semibold text-orange-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Cancellation &amp; Refund Policy (PDF)</a> before payment.</> },
  ];
  return (
    <Card id="trip-planning" className="scroll-mt-20 gap-5 border border-stone-200 bg-white p-5 text-slate-900 ring-0! sm:p-7">
      <div><p className="font-mono text-[10px] font-bold tracking-widest text-orange-800 uppercase">Before you book</p><h2 className="section-heading-accent mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Plan your departure</h2></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold"><CalendarDays aria-hidden="true" className="size-4 text-orange-800" /> Upcoming departures</h3>
          {departures.length ? <ul className="mt-3 flex flex-wrap gap-2">{departures.map((date) => <li key={date}><time dateTime={date} className="block rounded-lg bg-white px-3 py-2 font-mono text-xs">{new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</time></li>)}</ul> : <p className="mt-2 text-sm leading-relaxed text-slate-600">Contact Basecamp to confirm upcoming dates and availability.</p>}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold"><MapPin aria-hidden="true" className="size-4 text-sky-800" /> Meeting point</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{trip.meetingPoint || (trip.startingPoint ? `Route starts at ${trip.startingPoint}. Confirm the exact meeting location and reporting time with Basecamp.` : "Confirm the exact meeting location, reporting time and pickup arrangements with Basecamp.")}</p>
        </div>
        {sections.map(({ title, value, list, fallback }) => <div key={title} className="rounded-xl border border-stone-200 p-4"><h3 className="text-sm font-bold">{title}</h3>{value?.trim() && list ? <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600">{value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line, index) => <li key={index}>{line}</li>)}</ul> : <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{value?.trim() || fallback}</p>}</div>)}
      </div>
      <Link href={tripEnquiryHref(kind, trip.id)} className="inline-flex min-h-11 w-fit items-center rounded-lg bg-orange-700 px-4 text-sm font-bold text-white hover:bg-orange-800">Ask about this departure</Link>
    </Card>
  );
}
