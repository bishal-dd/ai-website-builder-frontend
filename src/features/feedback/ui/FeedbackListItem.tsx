import { FeedbackItem } from "../types/feedback";
import { StatusBadge } from "./StatusBadge";

type Props = {
  item: FeedbackItem;
  onSelect: (item: FeedbackItem) => void;
};

export function FeedbackListItem({ item, onSelect }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="group flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
      >
        <span className="min-w-0 flex-1">
          <span className="line-clamp-1 text-sm font-semibold leading-snug">
            {item.title}
          </span>

          <span className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {item.description}
          </span>

          <span className="mt-2 flex items-center">
            <StatusBadge status={item.status} />
          </span>
        </span>
      </button>
    </li>
  );
}

export function FeedbackListItemSkeleton() {
  return (
    <li className="flex gap-3 px-4 py-4">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </div>
    </li>
  );
}
