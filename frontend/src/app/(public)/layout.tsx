import type { ReactNode } from "react";


import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import WhatsAppWidget from "./_components/WhatsAppWidget";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <WhatsAppWidget />
    </>
  );
}
