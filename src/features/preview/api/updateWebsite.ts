import { WebsiteUpdate } from "../types";

export const updateWebsite = async (websiteId: string, body: WebsiteUpdate) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}`,
      {
        method: "PUT", // ✅ use PUT for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // ✅ send the actual object, not { body }
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Backend API Error:", errorText);
      return {
        success: false,
        error: `Backend returned ${res.status}: ${errorText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("🔥 Network or parsing error:", err);
    return {
      success: false,
      error: "Network error or invalid response from server",
    };
  }
};
