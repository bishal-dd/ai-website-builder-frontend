import { ProtectedRoute } from "@/shared/routes";
import AdminContactsPage from "@/features/admin/AdminContactsPage";

export default function AdminDashboardContactPage() {
  return (
    <ProtectedRoute>
      <AdminContactsPage />
    </ProtectedRoute>
  );
}
