import type { FeedbackStatus } from "../types/feedback";

type UpdateFeedbackStatusResponse = {
  message?: string;
  data?: {
    id: string;
    status: FeedbackStatus;
  };
};

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
): Promise<UpdateFeedbackStatusResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to update feedback status.");
  }

  return response.json();
}
