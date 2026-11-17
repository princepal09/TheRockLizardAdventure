import { pageMetadata } from "@/lib/page-metadata";
import RoadTripsSection from "./_components/home/RoadTripsSection";
import HeroSection from "./_components/home/HeroSection";
import AffiliationsSection from "./_components/home/AffiliationsSection";
import RegionGallerySection from "./_components/home/RegionGallerySection";
import FeaturedTreksSection from "./_components/home/FeaturedTreksSection";
import CustomExpeditionsBanner from "./_components/home/CustomExpeditionsBanner";
import ExpeditionsGridSection from "./_components/home/ExpeditionsGridSection";
import WhyChooseUsSection from "./_components/home/WhyChooseUsSection";
import TestimonialsSection from "./_components/home/TestimonialsSection";
import DispatchesSection from "./_components/home/DispatchesSection";
import FaqSection from "./_components/home/FaqSection";

export const metadata = pageMetadata(
  "Treks & Expeditions Across India",
  "Plan a guided trek or expedition in Kumaon, Garhwal or Kashmir with Rocklizard Adventure. Browse Himalayan routes and itineraries from our Almora-based team.",
  "/",
);

const Home = () => {
  return (
    <main className="flex flex-col min-h-screen bg-[#0b1120] text-white">
      <HeroSection />
      <RegionGallerySection />
      <FeaturedTreksSection />
      <CustomExpeditionsBanner />
      <ExpeditionsGridSection />
      <RoadTripsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <DispatchesSection />
      <AffiliationsSection />
      <FaqSection />
    </main>
  );
};

export default Home;
