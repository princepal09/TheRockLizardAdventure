import TripDetailPage from "../../_components/trip-detail";

export default function ExpeditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <TripDetailPage kind="expeditions" params={params} />;
}
