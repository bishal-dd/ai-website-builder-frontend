export const generateWebsiteInvoice = async (websiteId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/invoices/website/${websiteId}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to generate invoice");
  }

  return await res.blob();
};
