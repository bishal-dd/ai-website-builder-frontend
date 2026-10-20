const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface DomainEmailForwardingRule {
  mailbox: string;
  forwardTo: string;
}

export interface GetDomainEmailForwardingResponse {
  success: boolean;
  domain: string;
  forwardingRules: DomainEmailForwardingRule[];
}

export async function getDomainEmailForwarding(
  domainId: string,
): Promise<GetDomainEmailForwardingResponse> {
  const res = await fetch(
    `${BACKEND_URL}/domains/${encodeURIComponent(domainId)}/email-forwarding`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    let message = "Failed to fetch email forwarding rules.";

    try {
      const errorData = await res.json();
      message = errorData.error ?? message;
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message);
  }

  return res.json();
}
