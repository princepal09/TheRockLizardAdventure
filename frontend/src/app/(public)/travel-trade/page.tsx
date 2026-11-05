import { pageMetadata } from "@/lib/page-metadata";

import PartnerShowcase from "../_components/travel-trade/PartnerShowcase";
import PartnershipProcess from "../_components/travel-trade/PartnershipProcess";
import TravelTradeHero from "../_components/travel-trade/TravelTradeHero";

export const metadata = pageMetadata('Travel Trade Partnerships', 'Partner with Rock Lizard Adventure to plan guided treks and expeditions in Uttarakhand for your organisation or clients.', "/travel-trade");

export default function TravelTradePage() {
  return (
    <main className="bg-[#f5f3ee] text-slate-900">
      <TravelTradeHero />
      <PartnerShowcase />
      <PartnershipProcess />
    </main>
  );
}
