export interface UserGrowthStat {
  date: string;
  count: number;
}

export interface UserAnalyticsResponse {
  data: UserGrowthStat[];
}

export async function getUserGrowths(): Promise<UserGrowthStat[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics/users`;

  const res = await fetch(url, {
    credentials: "include",
    next: { tags: ["admin-user-analytics"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const data: UserAnalyticsResponse = await res.json();

  return data.data.map((item) => ({
    ...item,
    count: Number(item.count),
  }));
}
