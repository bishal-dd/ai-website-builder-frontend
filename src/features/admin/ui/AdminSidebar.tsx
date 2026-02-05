"use client";

import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const { user, signOut } = useSession();
  const pathname = usePathname();

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
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin"}
                  tooltip="Dashboard"
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard />
                    <span>Pending Websites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Add more Admin-specific items here */}
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
