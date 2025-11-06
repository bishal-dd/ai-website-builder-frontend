export const getPreviewWebsite = async (websiteId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/websites/${websiteId}/pages`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch website");
  }
  return await res.json();
};
