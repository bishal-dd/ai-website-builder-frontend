"use client";

import { useState } from "react";
import { searchDomainAPI, buyDomainAPI } from "../api/domainService";
import { DomainContact, DomainSuggestion } from "../types/domain";
import { useGeo } from "./useGeo";

export function useDomainModal() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const country = useGeo(); // detected country code

  // SEARCH DOMAINS
  const searchDomain = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // send country to backend for markup
      const results = await searchDomainAPI(
        keyword.trim(),
        country ?? undefined
      );

      if (!results || results.length === 0) {
        setSuggestions([]);
        return;
      }

      // Ensure exact match comes first
      const exactMatch = results.find(
        (r) => r.domain.toLowerCase() === keyword.trim().toLowerCase()
      );
      const alternatives = results.filter(
        (r) => r.domain.toLowerCase() !== keyword.trim().toLowerCase()
      );

      setSuggestions([...(exactMatch ? [exactMatch] : []), ...alternatives]);
    } catch (err) {
      console.error("Failed to search domains:", err);
      setError("Failed to search domains. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // BUY DOMAIN
  const buyDomain = async (domain: string, contact: DomainContact) => {
    if (!country) {
      console.warn("Country not detected, defaulting to USD pricing");
    }

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
    country, // expose detected country
  };
}
