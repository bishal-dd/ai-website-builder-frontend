import { ProtectedRoute } from "@/shared/routes";
import AdminAnalytics from "@/features/admin/AdminAnalytics";

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AdminAnalytics />
    </ProtectedRoute>
  );
}
