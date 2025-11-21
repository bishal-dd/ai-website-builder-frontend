import { DomainContact } from "../types/domain";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function searchDomainAPI(keyword: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/domains/suggest?keyword=${keyword}`);
  const data = await res.json();
  return data.suggestions || [];
}

export async function buyDomainAPI(domain: string, contact: DomainContact) {
  const res = await fetch(`${BASE_URL}/domains/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domainName: domain, contact }),
  });
  return await res.json();
}
