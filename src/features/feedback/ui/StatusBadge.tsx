import { cn } from "@/lib/utils";

import { FeedbackStatus } from "../types/feedback";
import { statusConfig } from "../constants/feedback";

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  const cfg = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        cfg.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
