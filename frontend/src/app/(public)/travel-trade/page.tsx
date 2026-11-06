import { permanentRedirect } from "next/navigation";

export default function LegacyTravelTradePage() {
  permanentRedirect("/collaborations");
}
