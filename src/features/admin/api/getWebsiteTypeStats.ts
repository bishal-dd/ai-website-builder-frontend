export interface WebsiteTypeStat {
  type: string | null;
  count: number;
}

export interface WebsiteTypeStatsResponse {
  data: WebsiteTypeStat[];
}

export async function getWebsiteTypeStats(): Promise<WebsiteTypeStatsResponse> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics/websites`;

  const res = await fetch(url, {
    credentials: "include",
    next: { tags: ["website-type-stats"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const data: WebsiteTypeStatsResponse = await res.json();

  return {
    data: data.data.map((item) => ({
      ...item,
      count: Number(item.count),
    })),
  };
}
