import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/ui/AdminSidebar";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Suspense
          fallback={<div className="w-[280px] h-full bg-slate-50 border-r" />}
        >
          <AdminSidebar />
        </Suspense>

        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-4 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
