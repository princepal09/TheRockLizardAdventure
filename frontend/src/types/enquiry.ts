export type EnquiryStatus = "READ" | "UNREAD";

type EnquiryTrip = {
  name: string;
  slug: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: EnquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  trek: EnquiryTrip | null;
  expedition: EnquiryTrip | null;
  trip: EnquiryTrip | null;
};

export type UpdateEnquiryInput = Partial<Pick<Enquiry, "status" | "adminNotes">>;

export type CreateEnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
} & (
  | { trekId?: never; expeditionId?: never; tripId?: never }
  | { trekId: string; expeditionId?: never; tripId?: never }
  | { expeditionId: string; trekId?: never; tripId?: never }
  | { tripId: string; trekId?: never; expeditionId?: never }
);
