import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Suspense } from "react";

import EnquiryDetails from "../_components/EnquiryDetails";

export const instant = false;

type EnquiryPageProps = { params: Promise<{ contactId: string }> };

async function EnquiryContent({ params }: EnquiryPageProps) {
  const { contactId } = await params;
  return <EnquiryDetails id={contactId} />;
}

export default function EnquiryPage({ params }: EnquiryPageProps) {
  return (
    <Suspense fallback={<ModuleSkeleton label="Loading enquiry" variant="form" />}>
      <EnquiryContent params={params} />
    </Suspense>
  );
}
