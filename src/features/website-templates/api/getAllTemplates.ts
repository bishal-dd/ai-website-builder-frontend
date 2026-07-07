import { WebsiteTemplate } from "../types";

export async function getAllTemplates(params?: {
  category?: string;
  search?: string;
}): Promise<WebsiteTemplate[]> {
  const query = new URLSearchParams();

  if (params?.category) {
    query.append("category", params.category);
  }

  if (params?.search) {
    query.append("search", params.search);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/templates${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch templates: ${text}`);
  }

  return res.json();
}
