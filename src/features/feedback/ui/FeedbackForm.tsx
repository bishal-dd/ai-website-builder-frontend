import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCreateFeedback } from "../hooks/useCreateFeedback";
import type { CreateFeedbackInput } from "../types/feedback";
import { BRAND } from "../constants/feedback";

type Props = {
  onCancel: () => void;
  onSuccess: () => void;
};

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const fieldClass =
  "w-full rounded-lg border bg-background outline-none placeholder:text-muted-foreground focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#C4B5FD]/40";

export function FeedbackForm({ onCancel, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const mutation = useCreateFeedback();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit =
    !mutation.isPending && !!title.trim() && !!description.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    // Keep the category required by the existing backend.
    // This is a hidden default, not a user-facing feedback type.
    const input: CreateFeedbackInput = {
      title: title.trim(),
      description: description.trim(),
      category: "other",
    };

    mutation.mutate(input, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["feedback"],
        });

        onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-150"
    >
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight">
            Share your feedback
          </h3>

          <p className="text-sm text-muted-foreground">
            Have an idea or something to share? We&apos;d love to hear it.
          </p>
        </div>

        {/* Title */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="feedback-title" className={labelClass}>
              Title
            </label>

            <span className="text-[11px] text-muted-foreground">
              {title.length}/150
            </span>
          </div>

          <input
            id="feedback-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={150}
            required
            autoFocus
            className={cn(
              fieldClass,
              "h-11 px-3 text-[15px] font-medium placeholder:font-normal",
            )}
          />
        </div>

        {/* Details */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="feedback-description" className={labelClass}>
              Details
            </label>

            <span className="text-[11px] text-muted-foreground">
              {description.length}/5000
            </span>
          </div>

          <textarea
            id="feedback-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us more about your feedback..."
            maxLength={5000}
            rows={6}
            required
            className={cn(
              fieldClass,
              "resize-none px-3 py-2.5 text-sm leading-relaxed",
            )}
          />
        </div>

        {mutation.isError && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2 border-t p-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="h-10 rounded-lg"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-10 flex-1 rounded-lg font-semibold text-black hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: BRAND }}
        >
          {mutation.isPending ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post feedback"
          )}
        </Button>
      </div>
    </form>
  );
}
