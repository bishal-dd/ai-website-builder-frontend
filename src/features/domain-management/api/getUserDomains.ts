import { Domain } from "../types/domain";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * ✅ Fetch all domains owned by the current user
 * Used to populate the DomainsPage list.
 */
export async function getUserDomains(): Promise<Domain[]> {
  const res = await fetch(`${BACKEND_URL}/domains/my-domains`, {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch domains: ${text}`);
  }

  return res.json();
}
