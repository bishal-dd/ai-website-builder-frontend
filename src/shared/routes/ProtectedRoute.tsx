"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../session";

type UserRole = "admin" | "user";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { authenticated, loading, user } = useSession();
  const router = useRouter();

  const isUserRole = (role?: string): role is UserRole => {
    return role === "admin" || role === "user";
  };

  const hasAccess =
    !allowedRoles ||
    (isUserRole(user?.role) && allowedRoles.includes(user.role));

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!hasAccess) {
      console.warn(
        `Access denied. Expected ${allowedRoles?.join(", ")}, got ${user?.role}`,
      );

      if (user?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [authenticated, loading, user, router, allowedRoles, hasAccess]);

  if (loading || !authenticated || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
