import { MessageSquare, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BRAND } from "../constants/feedback";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export function FeedbackLauncher({ open, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close feedback" : "Open feedback"}
      aria-expanded={open}
      className={cn(
        "fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full text-sm font-semibold text-black",
        "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.03]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2",
        open ? "size-12 max-sm:hidden" : "px-3 py-5",
      )}
      style={{ backgroundColor: BRAND }}
    >
      {open ? (
        <X className="size-5" />
      ) : (
        <>
          <MessageSquare className="size-5" />
          <span
            className="text-xs tracking-wide"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Feedback
          </span>
        </>
      )}
    </button>
  );
}
