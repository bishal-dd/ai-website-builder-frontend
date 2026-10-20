const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ConfigureDomainEmailForwardingInput {
  mailbox: string;
  forwardTo: string;
}

export interface ConfigureDomainEmailForwardingResponse {
  success: boolean;
  message: string;
  domain: string;
  email: string;
  forwardTo: string;
}

export async function configureDomainEmailForwarding(
  domainId: string,
  data: ConfigureDomainEmailForwardingInput,
): Promise<ConfigureDomainEmailForwardingResponse> {
  const res = await fetch(
    `${BACKEND_URL}/domains/${encodeURIComponent(domainId)}/email-forwarding`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    let message = "Failed to configure email forwarding.";

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
