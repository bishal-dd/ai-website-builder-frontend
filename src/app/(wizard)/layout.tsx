import { ProtectedRoute } from "@/shared/routes";
import Navbar from "@/shared/ui/Navbar";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="user">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
