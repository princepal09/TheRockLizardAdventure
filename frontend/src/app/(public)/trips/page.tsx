import { pageMetadata } from "@/lib/page-metadata";
import HeroBanner from "../_components/treks/HeroBanner";
import TripDiscovery from "../_components/treks/TripDiscovery";
import CustomInquiryBanner from "../_components/treks/CustomInquiryBanner";
export const metadata = pageMetadata(
  "Road & Bike Trips",
  "Explore road and bike trips across India. Compare routes, distances, vehicle arrangements, itineraries and confirmed departure details.",
  "/trips",
);
export default function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <main>
      <HeroBanner kind="trips" />
      <TripDiscovery kind="trips" searchParams={searchParams} />
      <div className="bg-[#f2f7fa] px-4 pb-8 sm:px-6 xl:px-10">
        <CustomInquiryBanner />
      </div>
    </main>
  );
}
