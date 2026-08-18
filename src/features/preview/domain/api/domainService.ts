import { DomainContact, DomainSuggestion } from "../types/domain";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function searchDomainAPI(
  keyword: string,
  country?: string,
): Promise<DomainSuggestion[]> {
  try {
    const url = new URL(`${BASE_URL}/domains/suggest`);
    url.searchParams.set("keyword", keyword);

    if (country) url.searchParams.set("country", country);

    const res = await fetch(url.toString());

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

export async function createPreOrder(data: {
  name?: string;
  websiteId?: string;
  userId?: string;
  country?: string;
}) {
  const res = await fetch(`${BASE_URL}/domains`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create pre-order: ${res.status}`);
  return res.json();
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

export async function updatePreOrder(data: {
  id: string;
  name: string;
  country: string;
}) {
  const res = await fetch(`${BASE_URL}/domains/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      country: data.country,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update domain: ${res.status}`);
  }

  return res.json();
}

export async function createCustomPreOrder(data: {
  websiteId: string;
  userId: string;
  country: string;
}) {
  const res = await fetch(`${BASE_URL}/domains/custom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create custom pre-order: ${res.status}`);
  }

  return res.json();
}

export async function updateDomainPriceAPI(data: {
  id: string;
  domainPrice: number;
}) {
  const res = await fetch(`${BASE_URL}/domains/${data.id}/price`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domainPrice: data.domainPrice,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(
      errorData?.error || `Failed to update domain price: ${res.status}`,
    );
  }

  return res.json();
}
