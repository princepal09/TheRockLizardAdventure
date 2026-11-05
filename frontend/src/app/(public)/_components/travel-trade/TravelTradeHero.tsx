import { ArrowDown, ArrowUpRight, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TravelTradeHero() {
  return (
    <section
      aria-labelledby="travel-trade-title"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <Image
        src="/image4.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/95 via-slate-950/75 to-slate-950/35"
      />
      <div className="mx-auto grid max-w-7xl items-end gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_19rem] xl:px-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/50 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-orange-200 uppercase">
            <Handshake aria-hidden="true" className="size-4" /> Travel Trade Partnerships
          </p>
          <h1
            id="travel-trade-title"
            className="mt-4 max-w-3xl font-heading text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] font-bold tracking-tight"
          >
            Bring your groups to <em className="font-medium text-orange-200">India.</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            We welcome partnership enquiries from adventure tour operators, travel agencies,
            mountaineering clubs, and outdoor education teams. You bring the group brief. We’ll work
            with you on the route and local arrangements from Almora.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/contact?topic=travel-trade#enquiry-form"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Send a Partnership Enquiry <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#trade-partners"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Meet Our Partners <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
        <aside className="max-w-md rounded-xl border border-white/20 bg-slate-950/70 p-5 backdrop-blur-sm">
          <h2 className="font-heading text-2xl font-bold">What is Travel Trade?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            It’s how organisations work with Rock Lizard to plan trips for their clients, students,
            or members. Start with your dates, group size, and experience level, and we’ll discuss
            what we can support.
          </p>
        </aside>
      </div>
    </section>
  );
}
