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
};

export type UpdateEnquiryInput = Partial<Pick<Enquiry, "status" | "adminNotes">>;
