import type { EnquiryStatus } from "@/types/enquiry";

export default function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status === "UNREAD"
        ? "bg-secondary/20 text-secondary-foreground"
        : "bg-tertiary/20 text-tertiary-foreground"}`}
    >
      {status === "UNREAD" ? "Unread" : "Read"}
    </span>
  );
}
