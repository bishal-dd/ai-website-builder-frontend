export interface WebsiteByType {
  title: string;
  description: string;
  status: string;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
}

export interface WebsitesByTypeResponse {
  data: WebsiteByType[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getWebsitesByType({
  type,
  page = 1,
  pageSize = 10,
  status,
}: {
  type: string;
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<WebsitesByTypeResponse> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/websites-by-type`,
  );

  url.searchParams.append("type", type);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  if (status?.trim()) {
    url.searchParams.append("status", status.trim());
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}
