import type { EmailDnsResponse, SaveEmailDnsInput } from "../types/dns";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function saveDomainEmailDnsRecords({
  domainId,
  records,
}: SaveEmailDnsInput): Promise<
  EmailDnsResponse & { success: boolean; message: string }
> {
  const res = await fetch(`${BACKEND_URL}/domains/${domainId}/email-dns`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to save email DNS records: ${text}`);
  }

  return res.json();
}
