"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  FeedbackResponse,
  FeedbackStatus,
} from "@/features/feedback/types/feedback";

interface FeedbackTableProps {
  items: FeedbackResponse[];
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  isUpdating: boolean;
  updatingFeedbackId?: string;
  recentlyUpdatedFeedbackId?: string;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
}

const editableStatuses: {
  label: string;
  value: FeedbackStatus;
}[] = [
  { label: "Open", value: "open" },
  { label: "Planned", value: "planned" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

const statusStyles: Record<FeedbackStatus, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  planned: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function FeedbackTable({
  items,
  currentPage,
  totalPages,
  isLoading = false,
  isUpdating,
  updatingFeedbackId,
  recentlyUpdatedFeedbackId,
  onPageChange,
  onStatusChange,
}: FeedbackTableProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="space-y-4">
      {/* Feedback table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Feedback
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Category
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Submitted
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="h-48 text-center text-muted-foreground"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="size-4 animate-spin" />
                        Loading feedback...
                      </span>
                    ) : (
                      <span className="inline-flex flex-col items-center gap-2">
                        <MessageSquare className="size-6 text-slate-300" />
                        No feedback found.
                      </span>
                    )}
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isCurrentItemUpdating =
                    isUpdating && updatingFeedbackId === item.id;

                  const wasRecentlyUpdated =
                    recentlyUpdatedFeedbackId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      <td className="max-w-lg px-5 py-4 align-top">
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 overflow-hidden whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                          {item.description}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {formatLabel(item.category)}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Select
                            value={item.status}
                            onValueChange={(value) =>
                              onStatusChange(item.id, value as FeedbackStatus)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger
                              aria-label={`Update status for ${item.title}`}
                              className={`h-8 w-36 rounded-full border text-xs font-medium ${statusStyles[item.status]}`}
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              {editableStatuses.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {isCurrentItemUpdating && (
                            <LoaderCircle
                              className="size-4 animate-spin text-muted-foreground"
                              aria-label="Updating status"
                            />
                          )}

                          {wasRecentlyUpdated && (
                            <CheckCircle2
                              className="size-4 text-emerald-600"
                              aria-label="Status updated"
                            />
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 align-top text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination — matches ContactsTable */}
      <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-medium text-slate-900">{currentPage}</span>{" "}
          of{" "}
          <span className="font-medium text-slate-900">{safeTotalPages}</span>
        </p>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || isLoading}
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(safeTotalPages, currentPage + 1))
              }
              disabled={
                currentPage >= safeTotalPages || isLoading || items.length === 0
              }
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
