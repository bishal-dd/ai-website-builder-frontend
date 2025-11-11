import { authClient } from "@/lib/auth-client";

export const signIn = async (email: string, password: string) => {
  try {
    const result = await authClient.signIn(email, password);

    if (result.user) {
      return { success: true, user: result.user };
    } else {
      return { error: result.error || "Authentication failed" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Authentication failed" };
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await authClient.signUp(email, password, name);

    if (result.user) {
      return { success: true, user: result.user };
    } else {
      return { error: result.error || "Registration failed" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Registration failed" };
  }
};

export const signOut = async () => {
  try {
    await authClient.signOut();
    return { success: true };
  } catch (error: unknown) {
    console.error("Sign out error:", error);
    return { success: false };
  }
};

export const signInSocial = async (provider: "google") => {
  try {
    const authUrl = authClient.getSocialAuthUrl(provider);
    window.location.href = authUrl;
  } catch (error: unknown) {
    console.error("Social sign-in failed:", error);
    throw error;
  }
};

export const getSession = async (cookieHeader?: string) => {
  try {
    console.log("🔄 getSession called");

    const headers: Record<string, string> = {};

    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/session`,
      {
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      console.log("❌ Session fetch failed:", response.status);
      return { user: null };
    }

    const session = await response.json();
    return session;
  } catch (error: unknown) {
    console.log(error);
    return { user: null };
  }
};
