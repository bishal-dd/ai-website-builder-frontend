import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/ui/AppSidebar";
import { DashboardContent } from "@/features/dashboard/ui/DashboardContent";
import { ProtectedRoute } from "@/shared/routes";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <DashboardContent />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
