import {
  Bug,
  Lightbulb,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FeedbackCategory, FeedbackStatus } from "../types/feedback";

export const BRAND = "#93C5FD";

export const categories: {
  value: FeedbackCategory;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    value: "feature",
    label: "Feature",
    hint: "Something new",
    icon: Lightbulb,
  },
  {
    value: "improvement",
    label: "Improvement",
    hint: "Make it better",
    icon: Sparkles,
  },
  { value: "bug", label: "Bug", hint: "Something's broken", icon: Bug },
  {
    value: "other",
    label: "Other",
    hint: "Anything else",
    icon: MessageCircle,
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.value, c]),
) as Record<FeedbackCategory, (typeof categories)[number]>;

export function getCategory(value: FeedbackCategory) {
  return categoryMap[value] ?? categoryMap.other;
}

export const statusConfig: Record<
  FeedbackStatus,
  { label: string; dot: string; badge: string }
> = {
  open: {
    label: "Open",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
  planned: {
    label: "Planned",
    dot: "bg-violet-500",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  in_progress: {
    label: "In progress",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  closed: {
    label: "Closed",
    dot: "bg-zinc-300 dark:bg-zinc-600",
    badge: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export const statusOrder = Object.keys(statusConfig) as FeedbackStatus[];
