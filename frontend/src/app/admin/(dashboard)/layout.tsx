"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthInit } from "@/stores/useAuthInit";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const session = useAuthInit();
  const shouldRedirect = session.isSuccess && (!session.data || !accessToken);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/admin/login");
    }
  }, [router, shouldRedirect]);

  if (session.isError) {
    return (
      <main className="mx-auto space-y-4 p-8">
        <p role="alert">
          We couldn&apos;t verify your session. Please try again.
        </p>
        <Button
          disabled={session.isFetching}
          onClick={() => void session.refetch()}
        >
          Retry
        </Button>
      </main>
    );
  }

  if (session.isPending || shouldRedirect) {
    return (
      <p role="status" className="p-8">
        Checking your session…
      </p>
    );
  }

  return children;
}
