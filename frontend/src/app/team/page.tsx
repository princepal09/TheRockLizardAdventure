import type { Metadata } from "next";

import TeamDirectory from "./TeamDirectory";

export const metadata: Metadata = { title: "Meet the Team" };

export default function TeamPage() {
  return <TeamDirectory />;
}
