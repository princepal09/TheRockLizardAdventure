import { pageMetadata } from "@/lib/page-metadata";
import CollaborationHero from "../_components/collaborations/CollaborationHero";
import CollaborationOpportunities from "../_components/collaborations/CollaborationOpportunities";
import CollaborationProcess from "../_components/collaborations/CollaborationProcess";

export const metadata = pageMetadata(
  "North India Company & NGO Collaborations",
  "Collaborate with Rock Lizard Adventure on company group journeys, NGO outdoor programmes and community-focused experiences across North India.",
  "/collaborations",
);

export default function CollaborationsPage() {
  return (
    <main className="bg-[#f5f3ee] text-slate-900">
      <CollaborationHero />
      <CollaborationOpportunities />
      <CollaborationProcess />
    </main>
  );
}
