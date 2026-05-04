"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import useWebsitesByType from "@/features/admin/hooks/useWebsitesByType";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { WebsitesByTypeTable } from "@/features/admin/ui/WebsitesByTypeTable";

const formatTypeLabel = (type: string) => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function WebsitesByTypePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";

  const rawType = params.type as string;
  const type = decodeURIComponent(rawType);

  const page = Number(searchParams.get("page")) || 1;

  const formattedType = formatTypeLabel(type);

  const { websites, pagination, isLoading, error } = useWebsitesByType(
    type,
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
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/admin/analytics/websites")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {formattedType} Websites
              </h1>
              <p className="text-muted-foreground text-sm">
                View websites under the {formattedType} category with contact
                and country details.
              </p>
            </div>
          </div>
        </header>

        <Separator className="mb-8" />

        <main>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-lg bg-slate-200" />
              <Skeleton className="h-64 w-full rounded-xl bg-slate-200" />
            </div>
          ) : (
            <WebsitesByTypeTable
              websites={websites}
              title={formattedType}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              totalCount={pagination?.totalCount || 0}
              status={status}
            />
          )}
        </main>
      </div>
    </div>
  );
}
