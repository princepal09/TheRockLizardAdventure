"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import LogoLoading from "@/components/ui/LogoLoading";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthInit } from "@/stores/useAuthInit";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardSidebar from "./_components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const endedByAdmin = useAuthStore((state) => state.endedByAdmin);
  const session = useAuthInit();
  const shouldRedirect = session.isSuccess && (!session.data || !accessToken);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(endedByAdmin ? "/admin/login" : "/");
    }
  }, [endedByAdmin, router, shouldRedirect]);

  if (session.isError) {
    return (
      <main className="mx-auto space-y-4 p-8">
        <p role="alert">We couldn&apos;t verify your session. Please try again.</p>
        <Button disabled={session.isFetching} onClick={() => void session.refetch()}>
          Retry
        </Button>
      </main>
    );
  }

  if (session.isPending || shouldRedirect) {
    return <LogoLoading label="Checking your session" />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <DashboardHeader />

      <div className="flex flex-1 min-w-0">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
