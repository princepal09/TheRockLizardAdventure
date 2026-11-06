import { tripMetadata } from "@/lib/trip-metadata";
import TripDetailPage from "../../_components/trip-detail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return tripMetadata("trips", slug);
}

export default function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  return <TripDetailPage kind="trips" params={params} />;
}
