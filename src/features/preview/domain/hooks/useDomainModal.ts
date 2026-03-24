"use client";

import { useState } from "react";
import {
  searchDomainAPI,
  buyDomainAPI,
  createPreOrder,
} from "../api/domainService";
import { DomainContact, DomainSuggestion } from "../types/domain";
import { useGeo } from "./useGeoContext";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import posthog from "posthog-js";

export function useDomainModal() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wizardCountry = useWizardStore((s) => s.country);

  const { country, loading: geoLoading } = useGeo();

  const normalizeDomain = (input: string) => {
    return input
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  };

  // SEARCH DOMAINS
  const searchDomain = async () => {
    const cleanedKeyword = normalizeDomain(keyword);

    if (!cleanedKeyword || geoLoading) return;
    setLoading(true);
    setError(null);

    try {
      const results = await searchDomainAPI(cleanedKeyword, country);

      // Capture domain searched event
      posthog.capture("domain_searched", {
        search_keyword: cleanedKeyword,
        results_count: results?.length || 0,
        country_code: country,
      });

      if (!results || results.length === 0) {
        setSuggestions([]);
        return;
      }

      const exactMatch = results.find(
        (r) => r.domain.toLowerCase() === cleanedKeyword,
      );

      const alternatives = results.filter(
        (r) => r.domain.toLowerCase() !== cleanedKeyword,
      );

      setSuggestions([...(exactMatch ? [exactMatch] : []), ...alternatives]);
    } catch (err) {
      console.error("Failed to search domains:", err);
      setError("Failed to search domains. Please try again.");
      setSuggestions([]);
      posthog.captureException(err);
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

  const preOrderDomain = async (
    domain: string,
    websiteId: string,
    userId: string,
  ) => {
    setBuying(domain);
    setError(null);

    try {
      const result = await createPreOrder({
        name: domain,
        websiteId,
        userId,
        country: wizardCountry || country || "",
      });
      return result;
    } catch (err) {
      console.error("Failed to pre-order domain:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to pre-order domain";
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
    preOrderDomain,
    country, // comes from GeoContext
    geoLoading, // optional if you want to block actions until ready
  };
}
