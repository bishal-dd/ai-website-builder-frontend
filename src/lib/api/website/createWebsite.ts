import { WizardStateForAPI, CreateWebsiteResponse } from "@/features/wizard/types";

export async function createWebsiteAPI(
  wizardState: WizardStateForAPI
): Promise<CreateWebsiteResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
