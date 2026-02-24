"use client";

import {
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSession } from "@/shared/session";
import { useSearchParams, usePathname } from "next/navigation";

export function AdminSidebar() {
  const { user, signOut } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentStatus = searchParams.get("status") || "pending";

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex justify-center">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-1.5 rounded-md">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate transition-all">
              Admin Portal
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Sencill AI
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Pending Websites */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentStatus === "pending"}
                  tooltip="Pending Approvals"
                >
                  <Link href="/admin/dashboard?status=pending">
                    <LayoutDashboard className="size-4" />
                    <span>Pending Websites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Approved Websites */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentStatus === "approved"}
                  tooltip="Approved Sites"
                >
                  <Link href="/admin/dashboard?status=approved">
                    <CheckCircle2 className="size-4" />
                    <span>Approved Websites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* New Contact/User Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/analytics"}
                  tooltip="User Contacts"
                >
                  <Link href="/admin/analytics">
                    <BarChart3 className="size-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start gap-3 px-2"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.name?.substring(0, 2).toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left text-xs leading-tight overflow-hidden">
                <span className="font-semibold truncate">{user?.name}</span>
                <span className="text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-56">
            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
