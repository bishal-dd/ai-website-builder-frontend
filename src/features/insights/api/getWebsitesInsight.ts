import { InsightWebsite } from "../types";

export type InsightPeriod = "today" | "week" | "month" | "year";

export async function getWebsitesInsight(
  period: InsightPeriod,
): Promise<InsightWebsite[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/insights/websites?period=${period}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`Failed to fetch insight websites: ${text}`);
  }

  return res.json();
}
