import { pageMetadata } from "@/lib/page-metadata";
import HeroSection from "./_components/home/HeroSection";
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
  "Explore guided treks and expeditions in Uttarakhand, Kashmir and Maharashtra with Rocklizard Adventure. Browse itineraries and plan your next adventure.",
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
      <WhyChooseUsSection />
      <TestimonialsSection />
      <DispatchesSection />
      <FaqSection />
    </main>
  );
};

export default Home;
