"use client";

import { useEffect, useState } from "react";
import { AlertCircle, MessageSquare, RefreshCw, Search, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useFeedback } from "@/features/feedback/hooks/useFeedback";
import { useFeedbackFilters } from "@/features/feedback/hooks/useFeedbackFilters";
import { useUpdateFeedbackStatus } from "@/features/feedback/hooks/useUpdateFeedbackStatus";

import type {
  FeedbackCategory,
  FeedbackStatus,
} from "@/features/feedback/types/feedback";
import { FeedbackTable } from "./ui/FeedbackTable";
import { useDebounce } from "@/shared/hooks/useDebounce";

const PAGE_SIZE = 10;

const categories: {
  label: string;
  value: FeedbackCategory | "all";
}[] = [
  { label: "All categories", value: "all" },
  { label: "Bug report", value: "bug" },
  { label: "Feature request", value: "feature" },
  { label: "Improvement", value: "improvement" },
  { label: "Other", value: "other" },
];

const statuses: {
  label: string;
  value: FeedbackStatus | "all";
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Planned", value: "planned" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

export default function AdminFeedbackPage() {
  const filters = useFeedbackFilters();
  const debouncedSearch = useDebounce(filters.search, 300);
  const [page, setPage] = useState(1);

  const offset = (page - 1) * PAGE_SIZE;

  const feedbackQuery = useFeedback({
    limit: PAGE_SIZE,
    offset,
    search: debouncedSearch,
    category: filters.category === "all" ? undefined : filters.category,
    status: filters.status === "all" ? undefined : filters.status,
  });

  const updateStatusMutation = useUpdateFeedbackStatus();

  const items = feedbackQuery.data?.data ?? [];
  const total = feedbackQuery.data?.pagination.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Reset pagination when the applied filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.category, filters.status]);

  // Keep the current page valid if the number of results decreases.
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleStatusChange = (id: string, status: FeedbackStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleClearFilters = () => {
    filters.clear();
    setPage(1);
  };

  const isInitialLoading = feedbackQuery.isPending;
  const isInitialError = feedbackQuery.isError && !feedbackQuery.data;
  const isEmpty = !isInitialLoading && !isInitialError && items.length === 0;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground shadow-md shadow-blue-100">
              <MessageSquare className="size-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                System Feedback
              </h1>

              <p className="text-sm text-muted-foreground">
                Review and manage feedback submitted by users.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Total feedback:{" "}
            <span className="font-semibold text-foreground">{total}</span>
          </div>
        </header>

        {/* Search and filters */}
        <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={filters.search}
              onChange={(event) => filters.setSearch(event.target.value)}
              placeholder="Search by title or description..."
              aria-label="Search feedback"
              maxLength={100}
              className="bg-white pl-10 pr-10"
            />

            {filters.search && (
              <button
                type="button"
                onClick={() => filters.setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Select
              value={filters.category}
              onValueChange={(value) =>
                filters.setCategory(value as FeedbackCategory | "all")
              }
            >
              <SelectTrigger
                aria-label="Filter by category"
                className="w-full bg-white sm:w-44"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                filters.setStatus(value as FeedbackStatus | "all")
              }
            >
              <SelectTrigger
                aria-label="Filter by status"
                className="w-full bg-white sm:w-40"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Filter summary */}
        <div className="mb-4 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {filters.hasFilters
              ? "Showing results matching your filters"
              : "Showing the latest submissions"}
          </span>

          <div className="flex items-center gap-3">
            {feedbackQuery.isFetching && feedbackQuery.data && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="size-3 animate-spin" />
                Updating results...
              </span>
            )}

            {filters.hasFilters && (
              <Button
                variant="link"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status update error */}
          {updateStatusMutation.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertTitle>Could not update status</AlertTitle>
              <AlertDescription className="flex flex-col items-start gap-3">
                <span>
                  {updateStatusMutation.error instanceof Error
                    ? updateStatusMutation.error.message
                    : "An unexpected error occurred."}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatusMutation.reset()}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Initial loading */}
          {isInitialLoading && (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
          )}

          {/* Initial loading error */}
          {isInitialError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error Loading Feedback</AlertTitle>
              <AlertDescription className="flex flex-col items-start gap-3">
                <span>
                  {feedbackQuery.error instanceof Error
                    ? feedbackQuery.error.message
                    : "An unexpected error occurred."}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => feedbackQuery.refetch()}
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="size-6 text-muted-foreground" />
              </div>

              <h2 className="font-semibold text-slate-900">
                {filters.hasFilters
                  ? "No matching feedback"
                  : "No feedback yet"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {filters.hasFilters
                  ? "Try adjusting your search or filters."
                  : "Feedback submitted by users will appear here."}
              </p>

              {filters.hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Feedback table and pagination */}
          {!isInitialLoading && !isInitialError && items.length > 0 && (
            <FeedbackTable
              items={items}
              currentPage={page}
              totalPages={totalPages}
              isLoading={feedbackQuery.isFetching}
              isUpdating={updateStatusMutation.isPending}
              updatingFeedbackId={updateStatusMutation.variables?.id}
              recentlyUpdatedFeedbackId={
                updateStatusMutation.isSuccess
                  ? updateStatusMutation.variables?.id
                  : undefined
              }
              onPageChange={setPage}
              onStatusChange={handleStatusChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
