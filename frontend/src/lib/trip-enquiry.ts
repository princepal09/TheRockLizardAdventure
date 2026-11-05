import type { TripKind } from "@/types/trip";

export function tripEnquiryHref(kind: TripKind, id: string) {
  return `/contact?${new URLSearchParams({ kind, trip: id })}#enquiry-form`;
}
