"use client";

import { useSearchParams } from "next/navigation";
import { AdminWebsitesTable } from "./ui/AdminWebsitesTable";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import useAdminWebsites from "@/features/admin/hooks/useAdminWebsites";

export default function AdminDashboard() {
  const searchParams = useSearchParams();

  // 1. Get current state DIRECTLY from the URL
  const websiteId = searchParams.get("websiteId") || "";
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "approval";

  // 2. The hook now automatically reacts whenever the URL changes
  const { websites, pagination, isLoading, error, refetch } = useAdminWebsites(
    websiteId,
    page,
    status,
  );

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
                Manage pending deployments.
              </p>
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        <main className="animate-in fade-in duration-500">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-xl bg-slate-200" />
            </div>
          ) : (
            <AdminWebsitesTable
              status={status}
              websites={websites}
              refresh={refetch}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
            />
          )}
        </main>
      </div>
    </div>
  );
}
