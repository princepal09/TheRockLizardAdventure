import { pageMetadata } from "@/lib/page-metadata";

import AboutHero from "../_components/about/AboutHero";
import AboutStory from "../_components/about/AboutStory";
import AboutPurpose from "../_components/about/AboutPurpose";
import AboutTeam from "../_components/about/AboutTeam";
import MountainStandard from "../_components/about/MountainStandard";

export const metadata = pageMetadata(
  "About Rocklizard Adventure",
  "Discover Rock Lizard Adventure’s story, vision and aims: trekking, mountaineering, outdoor learning for schools and responsible exploration from Almora.",
  "/about",
);

export default function AboutPage() {
  return (
    <main className="bg-[#f5f3ee] text-slate-900">
      <AboutHero />
      <AboutStory />
      <AboutPurpose />
      <AboutTeam />
      <MountainStandard />
    </main>
  );
}
