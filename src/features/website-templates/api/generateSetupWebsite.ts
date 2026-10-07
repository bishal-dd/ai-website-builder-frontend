export const generateSetupWebsite = async ({
  websiteId,
  title,
  description,
  contact_phone,
  social_links,
}: {
  websiteId: string;
  title: string;
  description: string;
  contact_phone: string | null;
  social_links: string | null;
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
        contact_phone,
        social_links,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to set up website");
  }

  return res.json();
};
