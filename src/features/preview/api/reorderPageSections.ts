export interface ReorderPageSectionsBody {
  sectionIds: number[];
}

export const reorderPageSections = async (
  pageId: string,
  body: ReorderPageSectionsBody,
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${pageId}/sections/reorder`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
