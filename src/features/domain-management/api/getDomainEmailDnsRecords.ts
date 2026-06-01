import type { EmailDnsResponse } from "../types/dns";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getDomainEmailDnsRecords(
  domainId: string,
): Promise<EmailDnsResponse> {
  const res = await fetch(`${BACKEND_URL}/domains/${domainId}/email-dns`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch email DNS records: ${text}`);
  }

  return res.json();
}
