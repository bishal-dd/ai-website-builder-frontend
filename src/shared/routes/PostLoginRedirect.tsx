"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/session";

export function PostLoginRedirect() {
  const { session, authenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!authenticated) return;
    if (!session?.user?.role) return;

    if (session.user.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/dashboard");
    }
  }, [loading, authenticated, session, router]);

  return null;
}
