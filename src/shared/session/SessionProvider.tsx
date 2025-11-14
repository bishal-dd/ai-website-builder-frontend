"use client";

import { useEffect } from "react";
import { useSessionStore } from "./sessionStore";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const fetchSession = useSessionStore((s) => s.fetchSession);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return <>{children}</>;
}
