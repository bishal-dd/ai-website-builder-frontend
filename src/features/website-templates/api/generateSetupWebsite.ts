export const generateSetupWebsite = async ({
  websiteId,
  title,
  description,
}: {
  websiteId: string;
  title: string;
  description: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}/setup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to set up website");
  }

  return res.json();
};
