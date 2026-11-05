import { pageMetadata } from "@/lib/page-metadata";

import AboutHero from "../_components/about/AboutHero";
import AboutStory from "../_components/about/AboutStory";
import AboutTeam from "../_components/about/AboutTeam";
import MountainStandard from "../_components/about/MountainStandard";

export const metadata = pageMetadata('About Rocklizard Adventure', 'Meet the Almora team behind Rocklizard Adventure’s treks and expeditions in Uttarakhand.', "/about");

export default function AboutPage() {
  return (
    <main className="bg-[#f5f3ee] text-slate-900">
      <AboutHero />
      <AboutStory />
      <AboutTeam />
      <MountainStandard />
    </main>
  );
}
