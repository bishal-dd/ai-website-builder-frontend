// Define the nested structure for a user's websites
export interface UserWebsite {
  id: string;
  title: string;
  contact_email: string | null;
  contact_phone: string | null;
  deployment_status: string;
}

// Define the User record with nested websites
export interface AdminUserContact {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  websites: UserWebsite[];
}

// Matching your response structure
export interface ContactsResponse {
  data: AdminUserContact[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getAdminContacts({
  page = 1,
  pageSize = 10,
  search = "", // 👈 Add search parameter
  date,
  startDate,
  endDate,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<ContactsResponse> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users-websites`,
  );

  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  if (search.trim()) {
    url.searchParams.append("search", search.trim()); // 👈 Send to backend
  }

  if (date?.trim()) {
    url.searchParams.append("date", date.trim());
  } else {
    if (startDate?.trim()) {
      url.searchParams.append("startDate", startDate.trim());
    }

    if (endDate?.trim()) {
      url.searchParams.append("endDate", endDate.trim());
    }
  }

  const res = await fetch(url.toString(), {
    credentials: "include",
    next: { tags: ["admin-contacts"] },
  });

  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}
