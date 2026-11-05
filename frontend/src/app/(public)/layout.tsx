import { Suspense, type ReactNode } from "react";


import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import PublicFloatingTools from "./_components/PublicFloatingTools";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <Suspense fallback={null}><PublicFloatingTools /></Suspense>
    </>
  );
}
