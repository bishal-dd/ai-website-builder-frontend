export const deletePage = async (pageId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${pageId}`,
      {
        method: "DELETE",
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

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("🔥 Network or parsing error:", err);

    return {
      success: false,
      error: "Network error or invalid response from server",
    };
  }
};
