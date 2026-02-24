export interface AdminStats {
  totalUsers: number;
  totalWebsites: number;
  totalGenerated: number;
  totalDeployed: number;
}

export interface CountryStat {
  country: string | null;
  count: number;
  percentage: number;
}

export interface AdminAnalyticsResponse {
  stats: AdminStats;
  countries: CountryStat[];
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics`;

  const res = await fetch(url, {
    credentials: "include",
    next: { tags: ["admin-analytics"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const data: AdminAnalyticsResponse = await res.json();

  return {
    stats: data.stats,
    countries: data.countries.map((c) => ({
      ...c,
      percentage: Number(c.percentage),
    })),
  };
}
