"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { InsightWebsiteCard } from "./ui/InsightWebsiteCard";
import { useWebsitesInsight } from "./hooks/useWebsitesInsight";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsightPeriod } from "./types";

export function InsightsContent() {
  const [period, setPeriod] = useState<InsightPeriod>("this_month");

  const { websites, isLoading, error } = useWebsitesInsight(period);

  const hasWebsites = websites.length > 0;

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="flex min-h-16 items-center gap-4 px-6">
          <SidebarTrigger className="-ml-2" />

          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Insights</h1>

              <p className="text-sm text-muted-foreground">
                Track your website performance and visitor activity.
              </p>
            </div>

            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as InsightPeriod)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all_time">All Time</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {isLoading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="mt-20 flex justify-center text-red-500">
            Error loading websites: {error.message}
          </div>
        ) : hasWebsites ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {websites.map((website) => (
              <InsightWebsiteCard key={website.id} website={website} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No deployed websites</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Deploy a website to start viewing its insights.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
