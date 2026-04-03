"use client";

import { useSessionStore } from "./sessionStore";
import { authClient } from "@/shared/helper/auth/authClient";

export function useSession() {
  const session = useSessionStore((s) => s.session);
  const loading = useSessionStore((s) => s.loading);
  const setSession = useSessionStore((s) => s.setSession);
  const fetchSession = useSessionStore((s) => s.fetchSession);

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
    window.location.href = "/auth/login";
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
