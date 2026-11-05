"use server";

import { updateTag } from "next/cache";
import {
  publicContentTags,
  type PublicContentScope,
} from "@/lib/public-content";

export async function refreshPublicContent(
  scope: PublicContentScope,
  accessToken: string,
): Promise<boolean> {
  if (
    typeof scope !== "string" ||
    !Object.hasOwn(publicContentTags, scope) ||
    typeof accessToken !== "string" ||
    !accessToken ||
    accessToken.length > 8192
  )
    return false;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return false;
  try {
    // Server Actions are public endpoints: authorize each invalidation independently.
    const session = await fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!session.ok) return false;
    for (const tag of publicContentTags[scope]) updateTag(tag);
    return true;
  } catch {
    return false;
  }
}
