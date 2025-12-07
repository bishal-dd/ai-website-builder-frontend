import {
  WizardStateForAPI,
  CreateWebsiteResponse,
} from "@/features/wizard/types";

export async function createWebsiteAPI(
  wizardState: WizardStateForAPI
): Promise<CreateWebsiteResponse> {
  try {
    // 1️⃣ Get the current session from Better Auth
    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/session`,
      { credentials: "include" } // important to send cookies
    );
    const sessionData = await sessionRes.json();
    const userId = sessionData?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: no user session found",
      };
    }

    // 2️⃣ Send the website creation request with userId in headers
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`, // match what backend expects
        },
        credentials: "include", // send cookies if needed
        body: JSON.stringify({ wizardState }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Backend API Error:", errorText);
      return {
        success: false,
        error: `Backend returned ${res.status}: ${errorText}`,
      };
    }

    const data: CreateWebsiteResponse = await res.json();
    return data;
  } catch (err) {
    console.error("🔥 Network or parsing error:", err);
    return {
      success: false,
      error: "Network error or invalid response from server",
    };
  }
}
