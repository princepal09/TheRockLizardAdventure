import { pageMetadata } from "@/lib/page-metadata";
import CustomInquiryBanner from "../_components/treks/CustomInquiryBanner";
import ExpeditionProtocolSection from "../_components/treks/ExpeditionProtocolSection";
import HeroBanner from "../_components/treks/HeroBanner";
import SeasonalGuideSection from "../_components/treks/SeasonalGuideSection";
import TripDiscovery from "../_components/treks/TripDiscovery";

export const metadata = pageMetadata('Himalayan Expeditions', 'Plan a Himalayan expedition with Rocklizard Adventure. Explore itineraries, departure details and preparation information.', "/expeditions");

export default function ExpeditionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <main>
      <HeroBanner kind="expeditions" />
      <TripDiscovery kind="expeditions" searchParams={searchParams} />
      <SeasonalGuideSection kind="expeditions" />
      <div className="space-y-6 bg-[#f2f7fa] px-4 py-8 sm:px-6 xl:px-10">
        <ExpeditionProtocolSection />
        <CustomInquiryBanner />
      </div>
    </main>
  );
}
