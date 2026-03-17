export interface UserGrowthStat {
  date: string;
  count: number;
}

export interface UserAnalyticsResponse {
  data: UserGrowthStat[];
}

export async function getUserGrowths(
  start?: string,
  end?: string,
): Promise<UserGrowthStat[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics/users`,
  );

  // Only add parameters if they are provided
  if (start) url.searchParams.append("start", start);
  if (end) url.searchParams.append("end", end);

  const res = await fetch(url.toString(), {
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
