export const generateWebsiteReceipt = async (websiteId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/receipts/website/${websiteId}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to generate receipt");
  }

  return await res.blob();
};
