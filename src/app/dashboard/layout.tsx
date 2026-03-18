import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/ui/AppSidebar";
import { ProtectedRoute } from "@/shared/routes"; // Import your guard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="user">
      <div className="pt-16">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
