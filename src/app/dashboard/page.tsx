import { DashboardContent } from "@/features/dashboard/ui/DashboardContent";
import { ProtectedRoute } from "@/shared/routes";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
