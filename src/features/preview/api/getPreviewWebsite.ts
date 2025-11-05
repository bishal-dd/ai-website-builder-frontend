export const getPreviewWebsite = async (websiteId: string) => {
  const res = await fetch(`http://localhost:4000/websites/${websiteId}/pages`);
  if (!res.ok) {
    throw new Error("Failed to fetch website");
  }
  return res.json();
};
