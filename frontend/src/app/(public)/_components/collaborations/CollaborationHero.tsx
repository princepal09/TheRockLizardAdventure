import { ArrowDown, ArrowUpRight, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CollaborationHero() {
  return (
    <section
      aria-labelledby="collaborations-title"
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
            <Handshake aria-hidden="true" className="size-4" /> Companies · NGOs · North India
          </p>
          <h1
            id="collaborations-title"
            className="mt-4 max-w-3xl font-heading text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] font-bold tracking-tight"
          >
            Create something meaningful <em className="font-medium text-orange-200">together.</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            We welcome collaboration enquiries from companies, NGOs and community organisations
            across North India. Bring your team, your purpose and your ideas. Let’s explore how a
            mountain journey or outdoor programme can support them.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/contact?topic=collaboration#enquiry-form"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Discuss a Collaboration <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#collaboration-opportunities"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Ways to Collaborate <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
        <aside className="max-w-md rounded-xl border border-white/20 bg-slate-950/70 p-5 backdrop-blur-sm">
          <h2 className="font-heading text-2xl font-bold">Your purpose. A shared plan.</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            From company team journeys to NGO field visits and outdoor learning, start a
            conversation with our Almora team. We’ll discuss the route, participant needs and
            arrangements your programme would require.
          </p>
        </aside>
      </div>
    </section>
  );
}
