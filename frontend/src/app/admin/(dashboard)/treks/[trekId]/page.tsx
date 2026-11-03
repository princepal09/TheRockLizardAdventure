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
    <Suspense fallback={<p role="status">Loading trek…</p>}>
      <TrekContent params={params} />
    </Suspense>
  );
}
