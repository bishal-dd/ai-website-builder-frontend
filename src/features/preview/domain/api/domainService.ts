import { DomainContact, DomainSuggestion } from "../types/domain";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function searchDomainAPI(
  keyword: string
): Promise<DomainSuggestion[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/domains/suggest?keyword=${encodeURIComponent(keyword)}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch domains: ${res.status}`);
    }

    const data = await res.json();

    if (data.suggestions && Array.isArray(data.suggestions)) {
      return data.suggestions;
    }

    return [];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function buyDomainAPI(domain: string, contact: DomainContact) {
  const res = await fetch(`${BASE_URL}/domains/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domainName: domain, contactInfo: contact }),
  });

  if (!res.ok) {
    throw new Error(`Failed to buy domain: ${res.status}`);
  }

  return await res.json();
}
