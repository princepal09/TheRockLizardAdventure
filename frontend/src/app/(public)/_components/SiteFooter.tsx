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
      <div className="w-full px-4 sm:px-6 xl:px-10">
        <SocialAndBrochureBar settings={settings} />
        <div className="grid gap-4 py-4 sm:gap-5 sm:py-5 md:grid-cols-2 md:items-start">
          <FooterLinksColumns />
          <BasecampInfoCard settings={settings} />
        </div>

        <CopyrightBar />
      </div>
    </footer>
  );
}
