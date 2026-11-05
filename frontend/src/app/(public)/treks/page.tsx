import { pageMetadata } from "@/lib/page-metadata";
import CustomInquiryBanner from "../_components/treks/CustomInquiryBanner";
import ExpeditionProtocolSection from "../_components/treks/ExpeditionProtocolSection";
import HeroBanner from "../_components/treks/HeroBanner";
import SeasonalGuideSection from "../_components/treks/SeasonalGuideSection";
import TripDiscovery from "../_components/treks/TripDiscovery";

export const metadata = pageMetadata(
  "Treks Across India",
  "Explore guided treks in Uttarakhand, Kashmir and Maharashtra. Compare routes, difficulty, itineraries and preparation details with Rocklizard Adventure.",
  "/treks",
);

export default function TreksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <main>
      <HeroBanner kind="treks" />
      <TripDiscovery kind="treks" searchParams={searchParams} />
      <SeasonalGuideSection kind="treks" />
      <div className="space-y-6 bg-[#f2f7fa] px-4 py-8 sm:px-6 xl:px-10">
        <ExpeditionProtocolSection />
        <CustomInquiryBanner />
      </div>
    </main>
  );
}
