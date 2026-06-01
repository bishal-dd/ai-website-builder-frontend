import type { EmailDnsRecord, EmailDnsResponse } from "../types/dns";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function deleteDomainEmailDnsRecord({
  domainId,
  record,
}: {
  domainId: string;
  record: EmailDnsRecord;
}): Promise<EmailDnsResponse & { success: boolean; message: string }> {
  const res = await fetch(`${BACKEND_URL}/domains/${domainId}/email-dns`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      record,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete email DNS record: ${text}`);
  }

  return res.json();
}
