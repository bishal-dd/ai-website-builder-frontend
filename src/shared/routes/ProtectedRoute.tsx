"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../session";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/auth"); // redirect to login
    }
  }, [authenticated, loading, router]);

  if (loading || !authenticated) return null;

  return <>{children}</>;
};
