import { getPublicSiteSettings } from "@/lib/api/public-site-settings";
import { basecampPhone } from "@/types/basecamp";
import SafetyProtocol from "./SafetyProtocol";
import WhatsAppWidget from "./WhatsAppWidget";

export default async function PublicFloatingTools() {
  const settings = await getPublicSiteSettings().catch(() => null);
  const phone = settings?.contactPhone ?? basecampPhone;
  return (
    <>
      <WhatsAppWidget phone={settings?.whatsappPhone ?? phone} callPhone={phone} />
      <SafetyProtocol phone={phone} />
    </>
  );
}
