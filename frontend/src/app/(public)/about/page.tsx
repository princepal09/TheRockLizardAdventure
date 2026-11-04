import type { Metadata } from "next";

import AboutHero from "../_components/about/AboutHero";
import AboutStory from "../_components/about/AboutStory";
import AboutTeam from "../_components/about/AboutTeam";
import MountainStandard from "../_components/about/MountainStandard";

export const metadata: Metadata = {
  title: "About Rocklizard Adventure",
  description:
    "Meet the Almora team behind Rocklizard Adventure’s treks and expeditions in Uttarakhand.",
};

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
