import { ProtectedRoute } from "@/shared/routes";
import { UserGrowthChart } from "@/features/admin/ui/UserGrowthChart";

export default function UserGrowthPage() {
  return (
    <ProtectedRoute>
      <UserGrowthChart />
    </ProtectedRoute>
  );
}
