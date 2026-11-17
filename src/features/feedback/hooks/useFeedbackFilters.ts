import { useState } from "react";
import type { FeedbackCategory, FeedbackStatus } from "../types/feedback";

export type CategoryFilter = FeedbackCategory | "all";
export type StatusFilter = FeedbackStatus | "all";

export function useFeedbackFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const hasFilters = !!search.trim() || category !== "all" || status !== "all";

  const clear = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  return {
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    hasFilters,
    clear,
  };
}

export type FeedbackFilters = ReturnType<typeof useFeedbackFilters>;
