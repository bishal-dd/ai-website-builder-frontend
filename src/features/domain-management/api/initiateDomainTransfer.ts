import { Domain } from "../types/domain";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * ✅ Request a domain transfer
 * Triggers backend email via Resend and updates DB status to 'transfer_requested'.
 */
export async function initiateDomainTransfer(
  domainId: string,
  domainName: string,
  userEmail: string,
): Promise<{ message: string; domain: Domain }> {
  const res = await fetch(`${BACKEND_URL}/domains/transfer/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: domainId,
      domainName,
      userEmail,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to initiate transfer: ${text}`);
  }

  return res.json();
}
