import { DashboardContent } from "@/features/dashboard/DashboardContent";
import { ProtectedRoute } from "@/shared/routes";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
