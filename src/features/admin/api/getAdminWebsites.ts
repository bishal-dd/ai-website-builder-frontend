export interface Website {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  deploymentStatus: string;
  domainPrice?: number | null;
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

export async function getAdminWebsites({
  websiteId,
  status,
  page = 1,
  pageSize = 10,
}: {
  websiteId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<WebsiteResponse> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/websites`,
  );

  if (websiteId?.trim()) {
    url.searchParams.append("websiteId", websiteId.trim());
  }

  if (status) {
    url.searchParams.append("status", status);
  }

  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  const res = await fetch(url.toString(), {
    credentials: "include",
    next: { tags: ["pending-websites"] },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}
