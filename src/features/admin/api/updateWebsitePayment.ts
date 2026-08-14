export interface PaymentUpdate {
  hostingPrice?: number;
  generationPrice?: number;
  totalAmount?: number;
  paidAmount?: number;
  paymentDate?: string;
  paymentType?: "full" | "installments";
  installmentAmount?: number;
  nextInstallmentDate?: string;
}

export interface Payment {
  id: string;
  websiteId: string;
  hostingPrice: number;
  generationPrice: number;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: string;
}

/**
 * Update payment for a specific website
 */
export async function updateWebsitePayment(
  websiteId: string,
  data: PaymentUpdate,
): Promise<Payment> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/website/${websiteId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}
