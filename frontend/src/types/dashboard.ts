import type { Enquiry } from "./enquiry";

export type DashboardSummary = {
  publishedTreks: number;
  publishedExpeditions: number;
  unreadEnquiries: number;
  recentEnquiries: Pick<Enquiry, "id" | "name" | "subject" | "status" | "createdAt">[];
};
