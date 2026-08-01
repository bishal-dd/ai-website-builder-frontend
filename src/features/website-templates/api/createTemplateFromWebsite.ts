export const createTemplateFromWebsite = async ({
  websiteId,
}: {
  websiteId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/templates/from-website`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        websiteId,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to create template");
  }

  return res.json();
};
