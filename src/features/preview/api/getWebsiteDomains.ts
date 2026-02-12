export const getWebsiteDomains = async (websiteId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/domains/website/${websiteId}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch domains");
  }
  return await res.json();
};
