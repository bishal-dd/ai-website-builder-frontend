import { InsightsContent } from "@/features/insights/InsightsContent";
import { ProtectedRoute } from "@/shared/routes";

export default function InsightsPage() {
  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <InsightsContent />
    </ProtectedRoute>
  );
}
