import { ArrowRight, Mountain, Shield, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";

import HeroBackground from "./HeroBackground";
import HeroEntrance from "./HeroEntrance";

const HeroSection = async () => {
  const settings = await getPublicSiteSettings().catch(() => null);
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[26rem] w-full overflow-hidden bg-[#0b1120] sm:min-h-[clamp(24.5rem,43vw,40rem)]"
    >
      <HeroBackground
        key={settings?.heroImageUrl}
        imageUrl={settings?.heroImageUrl}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,#0b1120e8_0%,#0b1120a6_52%,#0b112038_100%),linear-gradient(0deg,#0b1120bd_0%,transparent_72%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/arrow.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-fill"
        />
        <div className="absolute top-[8%] right-[8%] hidden w-[28%] sm:block">
          <Image
            src="/icon.svg"
            alt=""
            width={340}
            height={190}
            className="h-auto w-full"
          />
          <Image
            src="/icon-side.svg"
            alt=""
            width={226}
            height={31}
            className="absolute top-[86%] left-[5%] h-auto w-[63%]"
          />
        </div>
      </div>

      <HeroEntrance>
        <p className="inline-flex mt-10 flex-wrap items-center gap-x-2 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 font-mono text-[9px] tracking-wider uppercase sm:text-[10px]">
          <span className="font-bold text-orange-400">
            Kumaon Expedition Season
          </span>
          <span className="text-slate-200">· Autumn / Winter 2026</span>
        </p>
        <h1
          id="hero-heading"
          className="mt-2.5 text-[clamp(2.25rem,4.8vw,4.75rem)] leading-[1.05] font-extrabold tracking-[-0.055em] text-white"
        >
          The Glaciers{" "}
          <span className="font-heading font-medium tracking-[-0.045em] text-orange-200 italic">
            Are Calling
          </span>
        </h1>
        <p className="mt-4 max-w-[32rem] text-sm leading-relaxed text-slate-200 lg:text-base">
          Signature Kumaon glacier expeditions led by Almora&apos;s premier
          mountaineering crew with over 12 years of zero-incident trail
          stewardship.
        </p>
        <div className="mt-3 flex max-w-[36rem] items-center gap-2 sm:w-[65%]">
          <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
          <span className="hidden shrink-0 items-center gap-1 font-mono text-[9px] tracking-wider text-sky-300 uppercase md:inline-flex">
            <Mountain aria-hidden="true" className="size-3 text-orange-400" />
            3,660m Zero Point Summit
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-[#ffffff] transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore Our Treks{" "}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <UsersRound aria-hidden="true" className="size-3.5 text-sky-400" />{" "}
            Partner for B2B / Schools
          </Link>
        </div>
      </HeroEntrance>
      <span className="absolute top-[44%] right-0 z-10 hidden items-center gap-1.5 rounded-b-sm bg-orange-500 px-1.5 py-2 font-mono text-[9px] font-bold tracking-wider text-[#ffffff] uppercase [writing-mode:vertical-rl] sm:inline-flex">
        RLA Safety Protocol <Shield aria-hidden="true" className="size-3" />
      </span>
    </section>
  );
};

export default HeroSection;
