"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthInit } from "@/stores/useAuthInit";
import { MobileDashboardNavigation } from "./DashboardSidebar";
import SignOutConfirmation from "./SignOutConfirmation";

export default function DashboardHeader() {
  const { data: admin } = useAuthInit();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-primary text-primary-foreground shadow-sm">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <MobileDashboardNavigation
            onSignOut={() => logout.mutateAsync()}
            signingOut={logout.isPending}
          />
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
              <span className="block truncate text-sm font-semibold">Rock Lizard</span>
              <span className="block truncate text-xs text-tertiary">Basecamp Console</span>
            </span>
          </Link>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/admin/profile"
            aria-label="Open your profile"
            className="flex size-11 items-center justify-center gap-2 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-tertiary sm:h-9 sm:w-auto sm:px-1.5"
          >
            <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-tertiary text-tertiary-foreground">
              {admin?.profileImage ? (
                <Image
                  src={admin.profileImage}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 object-cover"
                />
              ) : (
                <UserRound aria-hidden="true" className="size-4" />
              )}
            </span>
            <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
              {admin?.name || "Admin"}
            </span>
          </Link>
          <div className="hidden md:flex">
            <SignOutConfirmation
              disabled={logout.isPending}
              onConfirm={() => logout.mutateAsync()}
              className="h-9 gap-2 px-3"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
