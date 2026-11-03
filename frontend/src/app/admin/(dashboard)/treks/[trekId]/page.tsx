import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Suspense } from "react";

import TripEditor from "../../_components/trips/TripEditor";

export const instant = false;

type TrekPageProps = { params: Promise<{ trekId: string }> };

async function TrekContent({ params }: TrekPageProps) {
  const { trekId } = await params;
  return <TripEditor kind="treks" id={trekId} />;
}

export default function TrekPage({ params }: TrekPageProps) {
  return (
    <Suspense fallback={<ModuleSkeleton label="Loading trek" variant="form" />}>
      <TrekContent params={params} />
    </Suspense>
  );
}
