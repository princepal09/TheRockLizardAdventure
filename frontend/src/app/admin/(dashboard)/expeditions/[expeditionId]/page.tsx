import ModuleSkeleton from "@/components/ui/ModuleSkeleton";
import { Suspense } from "react";

import TripEditor from "../../_components/trips/TripEditor";

export const instant = false;

type ExpeditionPageProps = { params: Promise<{ expeditionId: string }> };

async function ExpeditionContent({ params }: ExpeditionPageProps) {
  const { expeditionId } = await params;
  return <TripEditor kind="expeditions" id={expeditionId} />;
}

export default function ExpeditionPage({ params }: ExpeditionPageProps) {
  return (
    <Suspense fallback={<ModuleSkeleton label="Loading expedition" variant="form" />}>
      <ExpeditionContent params={params} />
    </Suspense>
  );
}

