export async function approvePayment(websiteId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/approve-payment`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ websiteId }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to approve payment");
  }

  return res.json();
}
