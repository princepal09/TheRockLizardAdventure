import { ArrowDown, ArrowUpRight, MapPin, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <Image
        src="/about.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[center_65%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0f172ad9_0%,#0f172a80_52%,#0f172a26_100%),linear-gradient(0deg,#0f172ab3,transparent_80%)]"
      />
      <div className="mx-auto grid min-h-[30rem] max-w-7xl items-end gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] xl:px-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/45 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-orange-200 uppercase">
            <Mountain aria-hidden="true" className="size-3.5" /> Rock Lizard Adventure · India
          </p>
          <h1
            id="about-heading"
            className="mt-4 max-w-3xl font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.98] font-bold tracking-tight"
          >
            The Almora Way of <em className="font-medium text-orange-200">Mountain Stewardship</em>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Meet the local team behind our treks and expeditions. We plan our routes from Almora and
            help visitors prepare for the mountains of Uttarakhand (Kumaon + Garhwal), Kashmir and
            Maharashtra.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#about-team"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-[#ffffff] hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Meet the Team <ArrowDown aria-hidden="true" className="size-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Talk to Basecamp <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
        <aside className="max-w-sm rounded-xl border border-white/15 bg-slate-950/70 p-4 backdrop-blur-sm sm:p-5">
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-sky-200 uppercase">
            <MapPin aria-hidden="true" className="size-3.5" /> Our operating base
          </p>
          <p className="mt-3 font-heading text-2xl font-bold">Almora</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            Route planning, pre-trek briefings, and expedition enquiries start at Basecamp.
          </p>
        </aside>
      </div>
    </section>
  );
}
