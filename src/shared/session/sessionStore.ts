"use client";

import { create } from "zustand";
import { authClient } from "@/shared/helper/auth/authClient";

export interface Session {
  token: string;
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role?: string; // <-- Add this here
    image?: string | null;
    countryCode?: string | null;
  };
}

interface SessionState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  fetchSession: () => Promise<Session | null>;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session }),

  fetchSession: async () => {
    try {
      const result = await authClient.getSession();

      if (result.data?.session && result.data?.user) {
        const mappedSession: Session = {
          ...result.data.session,
          user: result.data.user,
          expiresAt: result.data.session.expiresAt
            ? new Date(result.data.session.expiresAt).toISOString()
            : undefined,
        };

        set({ session: mappedSession, loading: false });

        return mappedSession;
      }

      set({ session: null, loading: false });
      return null;
    } catch {
      set({ session: null, loading: false });
      return null;
    }
  },
}));
