export interface Payment {
  id: string;
  websiteId: string;
  hostingPrice: number;
  generationPrice: number;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: string;
}

export async function getWebsitePayment(
  websiteId: string,
): Promise<Payment | null> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/website/${websiteId}`;

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const payments: Payment[] = await res.json();

  return payments[0] ?? null;
}
