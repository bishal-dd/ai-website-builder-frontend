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
    image?: string | null;
  };
}

interface SessionState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  fetchSession: () => Promise<void>;
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
      } else {
        set({ session: null, loading: false });
      }
    } catch {
      set({ session: null, loading: false });
    }
  },
}));
