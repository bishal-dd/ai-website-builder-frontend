import AdminDashboard from "@/features/admin/AdminDashboard";
import { ProtectedRoute } from "@/shared/routes";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
