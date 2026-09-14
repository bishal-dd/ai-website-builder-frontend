import { Pricing } from "../types/pricing";

export async function getPricing(): Promise<Pricing> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pricing`, {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch pricing: ${text}`);
  }

  return res.json();
}
