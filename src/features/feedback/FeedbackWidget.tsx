"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { FeedbackDetail } from "./ui/FeedbackDetail";
import { FeedbackForm } from "./ui/FeedbackForm";
import { FeedbackHeader } from "./ui/FeedbackHeader";
import { FeedbackLauncher } from "./ui/FeedbackLauncher";
import { FeedbackList } from "./ui/FeedbackList";

import { useFeedback } from "./hooks/useFeedback";
import type { FeedbackView, FeedbackItem } from "./types/feedback";

export function FeedbackWidget() {
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<FeedbackView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const feedbackQuery = useFeedback({
    limit: 20,
    offset: 0,
  });

  const items = feedbackQuery.data?.data ?? [];

  const selectedItem = items.find((item) => String(item.id) === selectedId);

  const navigate = (next: FeedbackView) => {
    setJustSubmitted(false);
    setView(next);
  };

  const close = useCallback(() => {
    setOpen(false);
    setView("list");
    setSelectedId(null);
    setJustSubmitted(false);
  }, []);

  // Focus the panel and close on Escape while open.
  useEffect(() => {
    if (!open) return;

    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const handleSelect = (item: FeedbackItem) => {
    setSelectedId(String(item.id));
    navigate("detail");
  };

  return (
    <>
      <FeedbackLauncher
        open={open}
        onToggle={() => (open ? close() : setOpen(true))}
      />

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Feedback"
          tabIndex={-1}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-background text-foreground outline-none",
            "animate-in fade-in slide-in-from-bottom-4 duration-200",
            "inset-0",
            "sm:inset-auto sm:bottom-20 sm:right-5 sm:h-[min(680px,calc(100vh-7rem))] sm:w-[400px]",
            "sm:rounded-2xl sm:border sm:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)]",
          )}
        >
          <FeedbackHeader
            view={view}
            count={feedbackQuery.data?.pagination?.total ?? 0}
            onNavigate={navigate}
            onClose={close}
          />

          {view === "list" && (
            <FeedbackList
              items={items}
              isPending={feedbackQuery.isPending}
              isError={feedbackQuery.isError}
              onRetry={() => feedbackQuery.refetch()}
              showSuccess={justSubmitted}
              onDismissSuccess={() => setJustSubmitted(false)}
              onSelect={handleSelect}
              onCreate={() => navigate("create")}
            />
          )}

          {view === "detail" && (
            <FeedbackDetail
              item={selectedItem}
              onBack={() => navigate("list")}
            />
          )}

          {view === "create" && (
            <FeedbackForm
              onCancel={() => navigate("list")}
              onSuccess={() => {
                setView("list");
                setJustSubmitted(true);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
