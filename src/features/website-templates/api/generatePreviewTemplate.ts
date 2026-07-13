export const generatePreviewTemplate = async (templateId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/preview/template`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateId }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to generate template preview",
    );
  }

  return res.json();
};
