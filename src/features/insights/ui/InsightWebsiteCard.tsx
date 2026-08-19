"use client";

import { Globe2 } from "lucide-react";

import { InsightWebsite } from "../types";

type InsightWebsiteCardProps = {
  website: InsightWebsite;
};

export function InsightWebsiteCard({ website }: InsightWebsiteCardProps) {
  return (
    <div className="rounded-xl border bg-background p-5">
      {/* Website Info */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Globe2 className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-medium">{website.name}</h3>

          <p className="truncate text-sm text-muted-foreground">
            {website.domain ?? "No domain"}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-5 border-t pt-4">
        <p className="text-xs text-muted-foreground">Total Views</p>

        <p className="mt-1 text-2xl font-semibold tracking-tight">
          {website.pageReloads}
        </p>
      </div>
    </div>
  );
}
