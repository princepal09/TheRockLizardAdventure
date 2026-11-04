import type { ReactNode } from "react";


import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
