import Preview from "@/features/preview/Preview";
import { ProtectedRoute } from "@/shared/routes";

export default function Home() {
  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <Preview />
    </ProtectedRoute>
  );
}
