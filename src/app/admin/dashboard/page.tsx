import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PendingWebsitesPage from "@/features/admin/PendingWebsitesPage";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <PendingWebsitesPage />
    </Suspense>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-100 w-full rounded-xl bg-slate-200" />
    </div>
  );
}
