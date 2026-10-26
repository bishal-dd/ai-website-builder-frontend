import { useFeedback } from "../hooks/useFeedback";

export type FeedbackCategory = "bug" | "feature" | "improvement" | "other";

export type FeedbackStatus =
  | "open"
  | "planned"
  | "in_progress"
  | "completed"
  | "closed";

export type CreateFeedbackInput = {
  title: string;
  description: string;
  category: FeedbackCategory;
};

export type FeedbackResponse = {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
};

export type FeedbackListResponse = {
  data: FeedbackResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type FeedbackView = "list" | "detail" | "create";

/** A single feedback item, derived from the useFeedback hook's response. */
export type FeedbackItem = NonNullable<
  ReturnType<typeof useFeedback>["data"]
>["data"][number];
