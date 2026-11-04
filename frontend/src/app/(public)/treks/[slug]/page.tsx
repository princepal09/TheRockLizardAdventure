import TripDetailPage from "../../_components/trip-detail";

export default function TrekPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <TripDetailPage kind="treks" params={params} />;
}
