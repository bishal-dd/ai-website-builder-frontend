import { Check, Lightbulb, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FeedbackListItem, FeedbackListItemSkeleton } from "./FeedbackListItem";

import { FeedbackItem } from "../types/feedback";
import { BRAND } from "../constants/feedback";

type Props = {
  items: FeedbackItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  showSuccess: boolean;
  onDismissSuccess: () => void;
  onSelect: (item: FeedbackItem) => void;
  onCreate: () => void;
};

export function FeedbackList({
  items,
  isPending,
  isError,
  onRetry,
  showSuccess,
  onDismissSuccess,
  onSelect,
  onCreate,
}: Props) {
  const isEmpty = !isPending && !isError && items.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showSuccess && <SuccessBanner onDismiss={onDismissSuccess} />}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending && (
          <ul className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <FeedbackListItemSkeleton key={i} />
            ))}
          </ul>
        )}

        {isError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 px-6 py-14 text-center"
          >
            <p className="text-sm text-destructive">
              Couldn&apos;t load feedback.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        )}

        {isEmpty && <EmptyState onCreate={onCreate} />}

        {!isPending && !isError && items.length > 0 && (
          <ul className="divide-y">
            {items.map((item) => (
              <FeedbackListItem key={item.id} item={item} onSelect={onSelect} />
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="shrink-0 border-t p-3">
          <Button
            type="button"
            onClick={onCreate}
            className="h-10 w-full gap-1.5 rounded-lg font-semibold text-black hover:opacity-90"
            style={{ backgroundColor: BRAND }}
          >
            <Plus className="size-4" />
            Post feedback
          </Button>
        </div>
      )}
    </div>
  );
}

function SuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 animate-in fade-in slide-in-from-top-1 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="size-3" strokeWidth={3} />
      </span>
      Thanks! Your idea has been posted.
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-auto rounded p-0.5 opacity-60 hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div
        className="flex size-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${BRAND}26` }}
      >
        <Lightbulb className="size-5" />
      </div>

      <div className="space-y-1">
        <p className="font-semibold">No ideas yet</p>

        <p className="max-w-[260px] text-sm text-muted-foreground">
          Be the first to share a suggestion or report an issue.
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onCreate}
        className="mt-1 gap-1.5 text-black hover:opacity-90"
        style={{ backgroundColor: BRAND }}
      >
        <Plus className="size-4" />
        Post feedback
      </Button>
    </div>
  );
}
