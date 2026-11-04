export const getWebsiteDetails = async (websiteId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch website details");
  }

  return await res.json();
};
