import { create } from "zustand";

interface AuthState {
  isSignIn: boolean;
  isLoading: boolean;
  error: string | null | undefined;

  setSignIn: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null | undefined) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignIn: true,
  isLoading: false,
  error: null,

  setSignIn: (value) => set({ isSignIn: value }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
