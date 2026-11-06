import type { Enquiry } from "./enquiry";

export type DashboardSummary = {
  publishedTreks: number;
  publishedExpeditions: number;
  publishedTrips: number;
  unreadEnquiries: number;
  recentEnquiries: Pick<Enquiry, "id" | "name" | "subject" | "status" | "createdAt">[];
};
