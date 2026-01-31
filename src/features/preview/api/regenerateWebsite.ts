export interface RegenerateWebsitePayload {
  websiteId: string;
  pageId: string;
  userMessage: string;
}

export interface RegenerateWebsiteResponse {
  jobId: string;
}

export async function regenerateWebsite(
  payload: RegenerateWebsitePayload,
): Promise<RegenerateWebsiteResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website/regenerate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error || "Failed to regenerate website");
  }

  const data: RegenerateWebsiteResponse = await res.json();

  if (!data.jobId) {
    throw new Error("Invalid response from server: missing jobId");
  }

  return data;
}
