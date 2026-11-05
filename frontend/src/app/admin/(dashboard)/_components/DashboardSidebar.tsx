"use client";
import { Dialog } from "@base-ui/react/dialog";
import {
  CalendarDays,
  Images,
  Inbox,
  LayoutDashboard,
  MapPin,
  Menu,
  Mountain,
  Route,
  Settings,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SignOutConfirmation from "./SignOutConfirmation";

type NavigationItem = { label: string; icon: LucideIcon; href?: string };

const groups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
      { label: "Enquiries", icon: Inbox, href: "/admin/enquiries" },
    ],
  },
  {
    label: "Trips",
    items: [
      { label: "Treks", icon: Route, href: "/admin/treks" },
      { label: "Expeditions", icon: Mountain, href: "/admin/expeditions" },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Regions", icon: MapPin, href: "/admin/regions" },
      { label: "Seasons", icon: CalendarDays, href: "/admin/seasons" },
      { label: "Gallery", icon: Images, href: "/admin/gallery" },
      { label: "Team", icon: UsersRound, href: "/admin/team" },
      { label: "Site Settings", icon: Settings, href: "/admin/site-settings" },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Profile", icon: UserRound, href: "/admin/profile" }],
  },
];

const itemClassName =
  "relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors";

function SidebarContents({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-4 p-3 pt-4">
      {groups.map(({ label, items }) => (
        <div key={label} className="space-y-1">
          <p className="px-3 pb-1 font-mono text-[11px] tracking-widest text-tertiary/85 uppercase">
            {label}
          </p>
          <ul className="space-y-0.5">
            {items.map(({ label, href, icon: Icon }) => {
              const active = href && (pathname === href || pathname.startsWith(`${href}/`));
              const content = (
                <>
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {label}
                </>
              );

              return (
                <li key={label}>
                  {href ? (
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`${itemClassName} hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-tertiary aria-[current=page]:bg-secondary aria-[current=page]:text-white font-semibold`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className={`${itemClassName} cursor-not-allowed text-primary-foreground/55`}
                    >
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 self-start overflow-y-auto border-r border-white/10 bg-primary text-primary-foreground md:block">
      <SidebarContents />
    </aside>
  );
}

export function MobileDashboardNavigation({
  onSignOut,
  signingOut,
}: {
  onSignOut: () => Promise<unknown>;
  signingOut: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className="shrink-0 md:hidden">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          aria-label="Open dashboard navigation"
          className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-tertiary transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-tertiary"
        >
          <Menu aria-hidden="true" className="size-5" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-primary/65 md:hidden" />
          <Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-white/10 bg-primary text-primary-foreground shadow-xl md:hidden">
            <Dialog.Title className="border-b border-white/10 px-5 py-5 pr-16 text-sm font-semibold">
              Basecamp navigation
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close dashboard navigation"
              className="absolute top-2 right-2 grid size-11 place-items-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-tertiary"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
            <SidebarContents onNavigate={() => setOpen(false)} />
            <div className="mt-auto border-t border-white/10 p-3">
              <SignOutConfirmation
                disabled={signingOut}
                onConfirm={onSignOut}
                className="min-h-11 w-full justify-start gap-2 px-3"
              />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
