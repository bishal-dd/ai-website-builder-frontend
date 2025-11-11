const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authClient = {
  async signIn(email: string, password: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/sign-in/email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (typeof window !== "undefined") {
      window.location.href = "/wizard";
      return data;
    }

    return data;
  },

  async signUp(email: string, password: string, name: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/sign-up/email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    if (typeof window !== "undefined") {
      window.location.href = "/wizard";
      return data;
    }

    return data;
  },

  async getSession(cookieHeader?: string) {
    const headers: Record<string, string> = {};

    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
        credentials: cookieHeader ? "omit" : "include",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        console.log("Session fetch failed with status:", response.status);
        return { user: null };
      }

      return await response.json();
    } catch (error) {
      console.error("Session fetch error:", error);
      return { user: null };
    }
  },

  async signOut() {
    const response = await fetch(`${BACKEND_URL}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include",
    });

    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }

    return response.json();
  },

  getSocialAuthUrl(provider: "google") {
    return `${BACKEND_URL}/api/auth/oauth/${provider}?callbackURL=${window.location.origin}/wizard`;
  },
};
