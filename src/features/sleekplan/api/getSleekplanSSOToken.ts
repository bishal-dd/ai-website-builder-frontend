interface SleekplanSSOResponse {
  success: true;
  token: string;
}

interface SleekplanSSOError {
  success: false;
  error: string;
}

type SleekplanSSOResult = SleekplanSSOResponse | SleekplanSSOError;

export const getSleekplanSSOToken = async (): Promise<SleekplanSSOResult> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integrations/sleekplan/sso`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorText = await res.text();

      console.error("❌ Sleekplan SSO API Error:", errorText);

      return {
        success: false,
        error: `Backend returned ${res.status}: ${errorText}`,
      };
    }

    const data: { token?: string } = await res.json();

    if (!data.token) {
      return {
        success: false,
        error: "SSO response did not contain a token",
      };
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    console.error("🔥 Sleekplan SSO network error:", error);

    return {
      success: false,
      error: "Network error or invalid response from server",
    };
  }
};
