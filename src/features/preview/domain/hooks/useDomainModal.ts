import { useState } from "react";
import { searchDomainAPI, buyDomainAPI } from "../api/domainService";
import { DomainContact, DomainSuggestion } from "../types/domain";

export function useDomainModal() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchDomain = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results = await searchDomainAPI(keyword.trim());

      if (!results || results.length === 0) {
        setSuggestions([]);
        return;
      }

      // Ensure the exact keyword is the first suggestion
      const exactMatch = results.find((r) => r.domain === keyword.trim());
      const alternatives = results.filter((r) => r.domain !== keyword.trim());

      setSuggestions([...(exactMatch ? [exactMatch] : []), ...alternatives]);
    } catch (err) {
      console.error("Failed to search domains:", err);
      setError("Failed to search domains. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const buyDomain = async (domain: string, contact: DomainContact) => {
    setBuying(domain);
    setError(null);
    try {
      const result = await buyDomainAPI(domain, contact);
      return result;
    } catch (err) {
      console.error("Failed to buy domain:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to buy domain";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setBuying(null);
    }
  };

  const clearError = () => setError(null);

  return {
    keyword,
    setKeyword,
    suggestions,
    loading,
    buying,
    error,
    clearError,
    searchDomain,
    buyDomain,
  };
}
