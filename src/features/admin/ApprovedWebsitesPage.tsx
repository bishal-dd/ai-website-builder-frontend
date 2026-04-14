"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import useAdminWebsites from "@/features/admin/hooks/useAdminWebsites";
import { ApprovedWebsitesTable } from "@/features/admin/ui/ApprovedWebsitesTable";

export default function ApprovedWebsitesPage() {
  const searchParams = useSearchParams();

  const websiteId = searchParams.get("websiteId") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { websites, pagination, isLoading, error, refetch } = useAdminWebsites(
    websiteId,
    page,
    "approved",
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
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <CheckCircle2 className="size-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Approved Websites
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage payment and deployed websites.
              </p>
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        <main>
          {isLoading ? (
            <Skeleton className="h-100 w-full rounded-xl bg-slate-200" />
          ) : (
            <ApprovedWebsitesTable
              websites={websites}
              refresh={refetch}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              totalCount={pagination?.totalCount || 0}
            />
          )}
        </main>
      </div>
    </div>
  );
}
