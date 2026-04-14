export type PayInstallmentInput = {
  websiteId: string;
  paymentDate: string;
};

export async function payInstallment(paymentData: PayInstallmentInput) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/installment/${paymentData.websiteId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentDate: paymentData.paymentDate,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to pay installment");
  }

  return res.json();
}
