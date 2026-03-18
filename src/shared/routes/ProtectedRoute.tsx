"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../session";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "admin" | "user";
}

export const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const { authenticated, loading, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRole && user?.role !== allowedRole) {
      console.warn(`Access denied. Expected ${allowedRole}, got ${user?.role}`);

      if (user?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [authenticated, loading, user, router, allowedRole]);

  if (
    loading ||
    !authenticated ||
    (allowedRole && user?.role !== allowedRole)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
