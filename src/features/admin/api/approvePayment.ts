export type PaymentInput = {
  websiteId: string;
  hostingPrice: number;
  generationPrice: number;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: string;
};

export async function approvePayment(paymentData: PaymentInput) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/approve-payment`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to approve payment");
  }

  return res.json();
}
