"use client";

import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useEnquiries } from "@/hooks/enquiries/useEnquiries";
import { getErrorMessage } from "@/utils/error";
import EnquiryStatusBadge from "./EnquiryStatusBadge";
import { useAdminBulkAction } from "@/hooks/useAdminBulkAction";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import BulkActionToolbar, { SelectionCheckbox } from "../../_components/BulkActionToolbar";

export default function EnquiriesList() {
  const enquiries = useEnquiries();
  const [status, setStatus] = useState("all");
  const visible = enquiries.data?.filter((item) => status === "all" || item.status === status);
  const markRead = useAdminBulkAction("enquiries");
  const eligibleIds =
    visible?.filter((item) => item.status === "UNREAD").map((item) => item.id) ?? [];
  const selection = useBulkSelection(eligibleIds);

  return (
    <section aria-labelledby="enquiries-heading" className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
            Workspace
          </p>
          <h1
            id="enquiries-heading"
            className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
          >
            Enquiries
          </h1>
          <p className="text-sm text-slate-600">
            Review messages from the website and manage their read status.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-primary">
          Status
          <select
            value={status}
            disabled={markRead.isPending}
            onChange={(event) => {
              setStatus(event.target.value);
              selection.clear();
            }}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 focus-visible:outline-2 focus-visible:outline-tertiary"
          >
            <option value="all">All enquiries</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
          </select>
        </label>
      </header>
      {enquiries.isSuccess && (
        <BulkActionToolbar
          selectedCount={selection.selectedIds.length}
          eligibleCount={eligibleIds.length}
          pending={markRead.isPending}
          actionLabel="Mark selected as read"
          onSelectAll={selection.selectAll}
          onClear={selection.clear}
          onExecute={() => markRead.mutateAsync(selection.selectedIds)}
        />
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {enquiries.isPending ? (
          <ModuleSkeleton label="Loading enquiries" />
        ) : enquiries.isError ? (
          <div className="space-y-3 p-6">
            <p role="alert" className="text-sm text-red-800">
              {getErrorMessage(enquiries.error)}
            </p>
            <Button
              variant="outline"
              disabled={enquiries.isFetching}
              onClick={() => void enquiries.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : visible?.length ? (
          <ul className="divide-y divide-slate-200">
            {visible.map((enquiry) => (
              <li key={enquiry.id} className="flex items-center pl-2">
                <SelectionCheckbox
                  label={`Select enquiry from ${enquiry.name}`}
                  checked={selection.isSelected(enquiry.id)}
                  disabled={markRead.isPending || enquiry.status === "READ"}
                  onChange={() => selection.toggle(enquiry.id)}
                />
                <Link
                  href={`/admin/enquiries/${encodeURIComponent(enquiry.id)}`}
                  className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:gap-5 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-primary">
                      {enquiry.subject || "General enquiry"}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {enquiry.name} · {enquiry.email}
                    </p>
                  </div>
                  <EnquiryStatusBadge status={enquiry.status} />
                  <time dateTime={enquiry.createdAt} className="text-xs text-slate-600 sm:text-sm">
                    {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </time>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 justify-self-end text-slate-500"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-sm text-slate-600">
            <Inbox aria-hidden="true" className="size-6 text-primary" />
            {status === "all" ? "No enquiries yet." : "No enquiries match this status."}
          </div>
        )}
      </div>
    </section>
  );
}
