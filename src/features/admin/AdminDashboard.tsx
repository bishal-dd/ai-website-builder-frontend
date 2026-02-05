"use client";

import { useState, useEffect } from "react"; // Added useEffect
import usePendingWebsites from "@/features/admin/hooks/usePendingWebsites";
import { PendingWebsitesTable } from "./ui/PendingWebsitesTable";
import { LogOut, LayoutDashboard, AlertCircle } from "lucide-react";
import { useSession } from "@/shared/session";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "./hooks/useDebounce";

export default function AdminDashboard() {
  const { signOut } = useSession();

  // 1. Search & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // 2. Reset page to 1 whenever search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // 3. Pass both debouncedSearch and current page to the hook
  const { websites, pagination, isLoading, error, refetch } =
    usePendingWebsites(debouncedSearch, page);

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : String(error)}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <LayoutDashboard className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage pending deployments and platform approvals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="hidden sm:flex"
            >
              Refresh Data
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </header>

        <Separator className="mb-8" />

        <main className="animate-in fade-in duration-500">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-64 bg-slate-200" />
                <Skeleton className="h-10 w-40 bg-slate-200" />
              </div>
              <Skeleton className="h-[400px] w-full rounded-xl bg-slate-200" />
            </div>
          ) : (
            <PendingWebsitesTable
              websites={websites}
              refresh={refetch}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
