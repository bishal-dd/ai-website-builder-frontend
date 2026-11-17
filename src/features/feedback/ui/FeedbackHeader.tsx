import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { FeedbackView } from "../types/feedback";
import { BRAND } from "../constants/feedback";

type Props = {
  view: FeedbackView;
  count: number;
  onNavigate: (view: FeedbackView) => void;
  onClose: () => void;
};

const tabs = [
  { key: "list", label: "Ideas" },
  { key: "create", label: "Suggest" },
] as const;

export function FeedbackHeader({ view, count, onNavigate, onClose }: Props) {
  return (
    <header
      className="shrink-0 px-5 pt-5 text-black"
      style={{ backgroundColor: BRAND }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-black/55">
            Sencill AI
          </p>
          <h2 className="mt-0.5 text-lg font-bold leading-tight">
            Feedback & ideas
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-black/65">
            Help shape what we build next.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1.5 -mt-1 rounded-full p-1.5 text-black/60 transition-colors hover:bg-black/10 hover:text-black"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="mt-4 flex gap-5 text-sm font-medium" role="tablist">
        {tabs.map(({ key, label }) => {
          // "detail" belongs to the Ideas tab
          const active = key === "list" ? view !== "create" : view === "create";

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onNavigate(key)}
              className={cn(
                "relative pb-3 transition-colors",
                active ? "text-black" : "text-black/50 hover:text-black/80",
              )}
            >
              {label}
              {key === "list" && count > 0 && (
                <span className="ml-1.5 rounded-full bg-black/10 px-1.5 py-px text-[11px]">
                  {count}
                </span>
              )}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-black transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </nav>
    </header>
  );
}
