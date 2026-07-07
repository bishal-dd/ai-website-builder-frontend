"use client";

import { CategoryGrid } from "./ui/CategoryGrid";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function WebsiteTemplateCategory() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="-ml-2" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Website Templates
              </h1>

              <p className="text-sm text-muted-foreground">
                Choose a category to explore professionally designed templates
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <CategoryGrid />
      </main>
    </div>
  );
}
