import { InsightWebsite } from "../types";

export async function getWebsitesInsight(): Promise<InsightWebsite[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/insights/websites`,
    { credentials: "include" },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch insight websites: ${text}`);
  }

  return res.json();
}
