"use client";

import { ArrowRight, Inbox, Mountain, Plus, Route } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/dashboard/useDashboardSummary";
import { useAuthInit } from "@/stores/useAuthInit";
import { getErrorMessage } from "@/utils/error";
import EnquiryStatusBadge from "../enquiries/_components/EnquiryStatusBadge";

const cards = [
  { label: "Published treks", key: "publishedTreks", href: "/admin/treks", icon: Route },
  { label: "Published expeditions", key: "publishedExpeditions", href: "/admin/expeditions", icon: Mountain },
  { label: "Unread enquiries", key: "unreadEnquiries", href: "/admin/enquiries", icon: Inbox },
] as const;

const enquiryDate = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export default function Dashboard() {
  const { data: admin } = useAuthInit();
  const summary = useDashboardSummary();
  const data = summary.data;

  return (
    <section aria-labelledby="dashboard-heading" className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Workspace</p>
          <h1 id="dashboard-heading" className="text-3xl font-bold tracking-tight text-primary">
            Dashboard overview
          </h1>
          {admin?.name && <p className="text-sm break-words text-slate-600">Welcome, {admin.name}.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/treks/new" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            <Plus aria-hidden="true" /> New trek
          </Link>
          <Link href="/admin/expeditions/new" className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Plus aria-hidden="true" /> New expedition
          </Link>
        </div>
      </header>

      {data ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-3" aria-label="Dashboard totals">
            {cards.map(({ label, key, href, icon: Icon }) => (
              <li key={key} className="min-w-0">
                <Link
                  href={href}
                  className="group block h-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-tertiary focus-visible:outline-2 focus-visible:outline-tertiary sm:p-5"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg bg-tertiary/20 text-tertiary-foreground">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4 text-slate-500 group-hover:text-primary" />
                  </span>
                  <span className="block space-y-1">
                    <span className="block text-sm font-medium text-slate-600">{label}</span>
                    <span className="block text-3xl font-bold text-primary tabular-nums">{data[key]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <section aria-labelledby="recent-enquiries-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
              <h2 id="recent-enquiries-heading" className="text-lg font-semibold text-primary">Recent enquiries</h2>
              <Link href="/admin/enquiries" className={buttonVariants({ variant: "outline" })}>
                View all enquiries <ArrowRight aria-hidden="true" />
              </Link>
            </header>
            {data.recentEnquiries.length ? (
              <ul className="divide-y divide-slate-200">
                {data.recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id}>
                    <Link
                      href={`/admin/enquiries/${encodeURIComponent(enquiry.id)}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-6"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-primary">{enquiry.subject || "General enquiry"}</span>
                        <span className="block truncate text-sm text-slate-600">{enquiry.name}</span>
                      </span>
                      <EnquiryStatusBadge status={enquiry.status} />
                      <time dateTime={enquiry.createdAt} className="text-xs text-slate-600 sm:text-sm">
                        {enquiryDate.format(new Date(enquiry.createdAt))}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-slate-600 sm:px-6">No enquiries yet.</p>
            )}
          </section>
        </>
      ) : summary.isError ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <p role="alert" className="text-sm text-red-800">{getErrorMessage(summary.error)}</p>
          <Button type="button" variant="outline" disabled={summary.isFetching} onClick={() => void summary.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <p role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Loading dashboard summary…
        </p>
      )}
    </section>
  );
}
