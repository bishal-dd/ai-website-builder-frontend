"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  AlertCircle,
  Search,
  Calendar as CalendarIcon,
  X,
  Check,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import useAdminContacts from "@/features/admin/hooks/useAdminContacts";
import { ContactsTable } from "./ui/ContactsTable";
import { useDebouncedCallback } from "./hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExportAdminUserEmails } from "./hooks/useExportAdminUserEmails";

export default function AdminContactsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- URL State ---
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const date = searchParams.get("date") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  // --- Calendar UI State ---
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      return {
        from: parseISO(startDate),
        to: parseISO(endDate),
      };
    }
    return undefined;
  });

  // --- Shared URL updater ---
  const updateQuery = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (
      key === "search" ||
      key === "date" ||
      key === "startDate" ||
      key === "endDate"
    ) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  // --- Apply range filter ---
  const applyDateRange = () => {
    if (!tempDate?.from || !tempDate?.to) return;

    const params = new URLSearchParams(searchParams.toString());

    params.delete("date");
    params.set("startDate", format(tempDate.from, "yyyy-MM-dd"));
    params.set("endDate", format(tempDate.to, "yyyy-MM-dd"));
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
    setCalendarOpen(false);
  };

  // --- Clear date filters ---
  const clearDateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("date");
    params.delete("startDate");
    params.delete("endDate");
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);

    setTempDate(undefined);
    setCalendarOpen(false);
  };

  // --- Fetch data ---
  const { users, pagination, isLoading, error } = useAdminContacts(
    page,
    10,
    searchQuery,
    status,
    date,
    startDate,
    endDate,
  );

  const exportMutation = useExportAdminUserEmails();

  const updateStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleExport = () => {
    exportMutation.mutate({
      search: searchQuery,
      status,
      date,
      startDate,
      endDate,
    });
  };

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Contacts</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground shadow-md shadow-blue-100">
              <Users className="size-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                User Contacts
              </h1>

              <p className="text-sm text-muted-foreground">
                Direct access to owner details and associated projects.
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Total users:{" "}
            <span className="font-semibold text-foreground">
              {pagination?.totalCount ?? 0}
            </span>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              key={searchQuery}
              defaultValue={searchQuery}
              placeholder="Search by name or email..."
              className="bg-white pl-10"
              onChange={(e) => updateQuery("search", e.target.value)}
            />
          </div>

          {/* Filter controls */}
          <div className="flex w-full items-center gap-2 md:w-auto">
            {/* Website status */}
            <Select value={status || "all"} onValueChange={updateStatus}>
              <SelectTrigger className="w-full bg-white md:w-40">
                <SelectValue placeholder="Website status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="not_created">Not created</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Date filter */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="size-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-auto p-0">
                <div className="flex items-center justify-between border-b p-3">
                  <span className="text-xs font-medium">Select Date Range</span>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDateFilters}
                      className="h-7 px-2 text-xs"
                    >
                      <X className="mr-1 size-3" />
                      Clear
                    </Button>

                    <Button
                      size="sm"
                      onClick={applyDateRange}
                      disabled={!tempDate?.from || !tempDate?.to}
                      className="h-7 px-2 text-xs"
                    >
                      <Check className="mr-1 size-3" />
                      Apply
                    </Button>
                  </div>
                </div>

                <Calendar
                  initialFocus
                  mode="range"
                  selected={tempDate}
                  onSelect={setTempDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Export */}
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="bg-white"
            >
              {exportMutation.isPending ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </section>

        {/* Active date filter */}
        {(date || (startDate && endDate)) && (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Filtered date:</span>

            <span className="font-semibold text-slate-900">
              {date || `${startDate} → ${endDate}`}
            </span>

            <button
              type="button"
              onClick={clearDateFilters}
              className="ml-1 text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        <Separator className="mb-8" />

        {/* Contacts */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-25 w-full rounded-xl" />
              <Skeleton className="h-100 w-full rounded-xl" />
            </div>
          ) : (
            <ContactsTable
              users={users}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={(newPage) =>
                updateQuery("page", newPage.toString())
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
