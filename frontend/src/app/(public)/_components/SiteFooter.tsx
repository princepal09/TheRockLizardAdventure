import ScrollReveal from "./ScrollReveal";
import Image from "next/image";
import Link from "next/link";

import { getPublicSiteSettings } from "@/lib/api/public-site-settings";

import CtaBanner from "./footer/CtaBanner";
import SocialAndBrochureBar from "./footer/SocialAndBrochureBar";
import FooterLinksColumns from "./footer/FooterLinksColumns";
import BasecampInfoCard from "./footer/BasecampInfoCard";
import CopyrightBar from "./footer/CopyrightBar";

export default async function SiteFooter() {
  const settings = await getPublicSiteSettings().catch(() => null);
  return (
    <footer className="bg-[#101829] text-slate-300">
      <CtaBanner phone={settings?.contactPhone} />
      <ScrollReveal className="w-full px-4 sm:px-6 xl:px-10">
        <SocialAndBrochureBar settings={settings} />
        <div className="grid gap-4 py-4 sm:gap-5 sm:py-5 md:grid-cols-2 md:items-start">
          <div className="flex min-w-0 flex-col items-start gap-4 lg:flex-row lg:gap-5 xl:gap-8">
            <Link
              href="/"
              className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
            >
              <Image
                src="/rocklizard-logo.svg"
                alt="Rock Lizard Adventure home"
                width={120}
                height={55}
                className="h-auto w-24 xl:w-30"
              />
            </Link>
            <div className="w-full min-w-0">
              <FooterLinksColumns />
            </div>
          </div>
          <BasecampInfoCard settings={settings} />
        </div>

        <CopyrightBar />
      </ScrollReveal>
    </footer>
  );
}
