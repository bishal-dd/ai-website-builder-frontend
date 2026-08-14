export interface PaymentInput {
  websiteId: string;
  hostingPrice: number;
  generationPrice: number;
  totalAmount: number;
  paymentDate?: string;
}

export interface Payment {
  id: string;
  websiteId: string;
  hostingPrice: number;
  generationPrice: number;
  totalAmount: number;
  paymentDate?: string;
}

/**
 * Create a new payment record
 */
export async function createWebsitePayment(
  data: PaymentInput,
): Promise<Payment> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments`;

  const res = await fetch(url, {
    method: "POST",
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
