// components/domain/DomainModal/useDomainModal.ts
import { useState } from "react";
import { searchDomainAPI, buyDomainAPI } from "../api/domainService";
import { DomainContact } from "../types/domain";

export function useDomainModal() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  const searchDomain = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const results = await searchDomainAPI(keyword);
      setSuggestions(results);
    } finally {
      setLoading(false);
    }
  };

  const buyDomain = async (domain: string, contact: DomainContact) => {
    setBuying(domain);
    try {
      const data = await buyDomainAPI(domain, contact);
      return data;
    } finally {
      setBuying(null);
    }
  };

  return {
    keyword,
    setKeyword,
    suggestions,
    loading,
    buying,
    searchDomain,
    buyDomain,
  };
}
