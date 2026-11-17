import { ArrowLeft, Clock } from "lucide-react";

import { StatusBadge } from "./StatusBadge";
import { formatLongDate } from "@/lib/utils";
import { FeedbackItem } from "../types/feedback";

type Props = {
  item: FeedbackItem | undefined;
  onBack: () => void;
};

export function FeedbackDetail({ item, onBack }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col animate-in fade-in slide-in-from-right-2 duration-150">
      <div className="shrink-0 border-b px-2 py-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All ideas
        </button>
      </div>

      {item ? (
        <DetailBody item={item} />
      ) : (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          This idea is no longer available.
        </p>
      )}
    </div>
  );
}

function DetailBody({ item }: { item: FeedbackItem }) {
  return (
    <article className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />
      </div>

      <h3 className="mt-3 break-words text-lg font-bold leading-snug">
        {item.title}
      </h3>

      <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3" />
        {formatLongDate(item.createdAt)}
      </p>

      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/85">
        {item.description}
      </p>
    </article>
  );
}
