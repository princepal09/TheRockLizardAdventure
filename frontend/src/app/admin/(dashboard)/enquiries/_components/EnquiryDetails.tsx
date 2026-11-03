"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useEnquiry, useUpdateEnquiry } from "@/hooks/enquiries/useEnquiries";
import type { Enquiry, EnquiryStatus } from "@/types/enquiry";
import { getErrorMessage } from "@/utils/error";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

function EnquiryEditor({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter();
  const update = useUpdateEnquiry(enquiry.id);
  const [draftStatus, setDraftStatus] = useState<EnquiryStatus>();
  const status = draftStatus ?? enquiry.status;
  const hasChanges = status !== enquiry.status;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (update.isPending || !hasChanges) return;

    try {
      await update.mutateAsync({ status });
      router.replace("/admin/enquiries");
    } catch {
      // The mutation error is displayed next to the form.
    }
  }

  return (
    <form noValidate onSubmit={save} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold text-primary">Enquiry management</h2>
      <label className="block space-y-1.5 text-sm font-medium">
        <span className="block">Status</span>
        <select
          value={status}
          onChange={(event) => setDraftStatus(event.target.value === "READ" ? "READ" : "UNREAD")}
          disabled={update.isPending}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 focus-visible:outline-2 focus-visible:outline-tertiary"
        >
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
        </select>
      </label>
      {update.isError && <p role="alert" className="text-sm text-red-800">{getErrorMessage(update.error)}</p>}
      <Button
        type="submit"
        disabled={update.isPending || !hasChanges}
        className="min-h-11 bg-secondary px-4 text-white hover:bg-secondary/90"
      >
        {update.isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

export default function EnquiryDetails({ id }: { id: string }) {
  const query = useEnquiry(id);
  const enquiry = query.data;
  const trip = enquiry?.trek ?? enquiry?.expedition;

  return (
    <section aria-labelledby="enquiry-heading" className="mx-auto max-w-6xl space-y-5">
      <Link href="/admin/enquiries" className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-tertiary">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to enquiries
      </Link>
      <h1 id="enquiry-heading" className="text-2xl font-bold tracking-tight break-words text-primary sm:text-3xl">
        {enquiry?.subject || "Enquiry details"}
      </h1>
      {query.isPending ? (
        <p role="status" className="text-sm text-slate-600">Loading enquiry…</p>
      ) : query.isError ? (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-red-800">{getErrorMessage(query.error)}</p>
          <Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()}>Retry</Button>
        </div>
      ) : enquiry ? (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <article className="min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h2 className="font-semibold break-words text-primary">{enquiry.name}</h2>
                <p className="text-sm break-all text-slate-600">{enquiry.email}</p>
                {enquiry.phone && <p className="text-sm break-all text-slate-600">{enquiry.phone}</p>}
                <time dateTime={enquiry.createdAt} className="block text-xs text-slate-600">
                  {new Date(enquiry.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <EnquiryStatusBadge status={enquiry.status} />
            </header>
            {trip && (
              <p className="rounded-lg bg-tertiary/10 px-3 py-2 text-sm break-words text-tertiary-foreground">
                <span className="font-semibold">{enquiry.trek ? "Trek" : "Expedition"}</span> · {trip.name}
              </p>
            )}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-primary">Message</h3>
              <p className="text-sm leading-6 break-words whitespace-pre-wrap text-slate-700">{enquiry.message}</p>
            </div>
          </article>
          <EnquiryEditor key={enquiry.id} enquiry={enquiry} />
        </div>
      ) : null}
    </section>
  );
}
