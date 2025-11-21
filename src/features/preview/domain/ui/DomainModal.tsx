// components/domain/DomainModal/DomainModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDomainModal } from "../hooks/useDomainModal";
import { DomainContact } from "../types/domain";

interface DomainModalProps {
  onClose: () => void;
  contact: DomainContact;
}

export function DomainModal({ onClose, contact }: DomainModalProps) {
  const {
    keyword,
    setKeyword,
    suggestions,
    loading,
    buying,
    searchDomain,
    buyDomain,
  } = useDomainModal();

  const handleBuy = async (domain: string) => {
    const result = await buyDomain(domain, contact);
    if (result.success) alert(`Domain ${domain} registered successfully!`);
    else alert(`Failed: ${result.error?.message || "Unknown error"}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">Search & Buy Domain</h2>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={searchDomain} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="flex flex-col gap-2 max-h-64 overflow-auto">
          {suggestions.length === 0 && <p>No suggestions yet</p>}
          {suggestions.map((domain) => (
            <div
              key={domain}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>{domain}</span>
              <Button
                size="sm"
                onClick={() => handleBuy(domain)}
                disabled={buying === domain}
              >
                {buying === domain ? "Buying..." : "Buy"}
              </Button>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
