import type { FeedbackResponse } from "../types/feedback";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type GetFeedbackParams = {
  limit?: number;
  offset?: number;
  category?: FeedbackResponse["category"];
  status?: FeedbackResponse["status"];
  search?: string;
};

export type GetFeedbackResponse = {
  data: FeedbackResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export async function getFeedback(
  params: GetFeedbackParams = {},
): Promise<GetFeedbackResponse> {
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const queryString = searchParams.toString();
  const url = `${BACKEND_URL}/feedback${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch feedback: ${text}`);
  }

  return res.json();
}
