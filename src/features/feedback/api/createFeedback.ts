import { CreateFeedbackInput, FeedbackResponse } from "../types/feedback";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createFeedback(
  input: CreateFeedbackInput,
): Promise<FeedbackResponse> {
  const res = await fetch(`${BACKEND_URL}/feedback`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create feedback: ${text}`);
  }

  return res.json();
}
