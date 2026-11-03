"use client";

import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthInit } from "@/stores/useAuthInit";
import { getErrorMessage } from "@/utils/error";
import { MobileDashboardNavigation } from "./DashboardSidebar";

export default function DashboardHeader() {
  const { data: admin } = useAuthInit();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-primary text-primary-foreground shadow-sm">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <MobileDashboardNavigation />
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-tertiary"
          >
            <span className="hidden h-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 px-2 sm:grid">
              <Image
                src="/admin-login/logo.png"
                alt=""
                width={64}
                height={28}
                className="h-auto w-14"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                Rock Lizard
              </span>
              <span className="block truncate text-xs text-tertiary">
                Basecamp Console
              </span>
            </span>
          </Link>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary text-tertiary-foreground">
              <UserRound aria-hidden="true" className="size-4" />
            </span>
            <span className="max-w-40 truncate text-sm font-medium">
              {admin?.name || "Admin"}
            </span>
          </div>
          <Button
            aria-label="Log out"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
            className="size-11 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-tertiary/60 sm:h-9 sm:w-auto sm:px-3"
          >
            <LogOut aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">
              {logout.isPending ? "Signing out…" : "Sign out"}
            </span>
          </Button>
        </div>
      </div>
      {logout.isError && (
        <p
          role="alert"
          className="absolute top-full right-3 mt-2 max-w-[calc(100%-1.5rem)] rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 shadow-sm"
        >
          {getErrorMessage(logout.error)}
        </p>
      )}
    </header>
  );
}
