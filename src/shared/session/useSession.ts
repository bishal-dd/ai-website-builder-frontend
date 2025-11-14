"use client";

import { useSessionStore } from "./sessionStore";
import { authClient } from "@/shared/helper/auth/authClient";
import { useRouter } from "next/navigation";

export function useSession() {
  const session = useSessionStore((s) => s.session);
  const loading = useSessionStore((s) => s.loading);
  const setSession = useSessionStore((s) => s.setSession);
  const fetchSession = useSessionStore((s) => s.fetchSession);
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
    router.push("/auth");
    router.refresh();
  };
  return {
    session,
    user: session?.user ?? null,
    loading,
    setSession,
    refresh: fetchSession,
    authenticated: !!session?.user,
    signOut,
  };
}
