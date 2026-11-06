import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Suspense } from "react";

import TripEditor from "../../_components/trips/TripEditor";

export const instant = false;

type TripPageProps = { params: Promise<{ tripId: string }> };

async function TripContent({ params }: TripPageProps) {
  const { tripId } = await params;
  return <TripEditor kind="trips" id={tripId} />;
}

export default function TripPage({ params }: TripPageProps) {
  return (
    <Suspense fallback={<ModuleSkeleton label="Loading trip" variant="form" />}>
      <TripContent params={params} />
    </Suspense>
  );
}
