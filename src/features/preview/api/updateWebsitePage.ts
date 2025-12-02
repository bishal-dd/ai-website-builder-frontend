import { PageUpdate } from "../types";

export const updateWebsitePage = async (pageId: string, body: PageUpdate) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${pageId}`,
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
