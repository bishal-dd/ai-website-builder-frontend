export interface Website {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  deploymentStatus: string;
}

// New interface to match the backend response
export interface WebsiteResponse {
  websites: Website[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getPendingWebsites(
  userId?: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<WebsiteResponse> {
  // Changed from Website[] to WebsiteResponse
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/pending-websites`,
  );

  // Append Search Query
  if (userId) {
    url.searchParams.append("userId", userId);
  }

  // Append Pagination Params
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch pending websites: ${text}`);
  }

  // Returns the full object: { websites: [...], pagination: {...} }
  return await res.json();
}
