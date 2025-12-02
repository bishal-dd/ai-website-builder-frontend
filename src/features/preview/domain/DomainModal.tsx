"use client";

import { useState } from "react";
import { Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDomainModal } from "./hooks/useDomainModal";
import {
  DomainContact,
  DomainSuggestion,
  SelectedDomain,
} from "./types/domain";
import { SearchInput } from "./ui/SearchInput";
import { DomainCard } from "./ui/DomainCard";
import { PaymentSummary } from "./ui/PaymentSummary";
import { ErrorMessage } from "./ui/ErrorMessage";
import { useGeo } from "./hooks/useGeoContext";

interface DomainModalProps {
  onClose: () => void;
  contact: DomainContact;
}

export function DomainModal({ onClose, contact }: DomainModalProps) {
  const [step, setStep] = useState<"selection" | "pricing">("selection");
  const [selectedDomain, setSelectedDomain] = useState<SelectedDomain | null>(
    null
  );

  // ✅ Use GeoContext
  const { country: countryCode, loading: geoLoading } = useGeo();

  // ✅ Domain search hook
  const { keyword, setKeyword, suggestions, loading, error, searchDomain } =
    useDomainModal();

  // Handle domain selection
  const handleSelectDomain = (domain: DomainSuggestion) => {
    if (geoLoading) return; // wait until geo loaded

    const hostingPrice = countryCode === "BT" ? 3000 : 9.99;
    const websitePrice = countryCode === "BT" ? 7000 : 49.99;

    setSelectedDomain({
      domain: domain.domain,
      price: domain.price,
      hostingPrice,
      websitePrice,
      currency: countryCode === "BT" ? "BTN" : "USD",
    });

    setStep("pricing");
  };

  const handleBackToSelection = () => setStep("selection");

  // WhatsApp payment
  const handleWhatsAppPayment = () => {
    if (!selectedDomain) return;

    const total =
      selectedDomain.price +
      (selectedDomain.hostingPrice ?? 0) +
      (selectedDomain.websitePrice ?? 0);

    const message = encodeURIComponent(
      `Hi! I'd like to purchase:\n\nDomain: ${selectedDomain.domain}\nDomain Price: ${selectedDomain.price}\nHosting: ${selectedDomain.hostingPrice}\nWebsite Generation: ${selectedDomain.websitePrice}\nTotal: ${total}\nContact: ${contact.email}`
    );

    window.open(`https://wa.me/77952712?text=${message}`, "_blank");
  };

  // International payment placeholder
  const handleInternationalPayment = () => {
    alert("Payment gateway integration goes here!");
  };

  // ✅ Payment step
  if (step === "pricing" && selectedDomain) {
    return (
      <PaymentSummary
        selectedDomain={selectedDomain}
        contact={contact}
        onClose={onClose}
        onBack={handleBackToSelection}
        handleWhatsAppPayment={handleWhatsAppPayment}
        handleInternationalPayment={handleInternationalPayment}
        countryCode={countryCode}
      />
    );
  }

  // DOMAIN SELECTION LOGIC
  const cleanKeyword = keyword.trim();
  const exactMatch = suggestions.find(
    (s) => s.domain.toLowerCase() === cleanKeyword.toLowerCase()
  );
  const alternatives = suggestions.filter(
    (s) => s.domain !== cleanKeyword && s.available
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Find a Domain</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* SEARCH */}
        <div className="p-4 space-y-3 shrink-0">
          <SearchInput
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={searchDomain}
            loading={loading || geoLoading} // disable while geo is loading
          />
          {error && <ErrorMessage message={error} />}
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-3 bg-muted/50 shrink-0">
            <h3 className="text-sm font-medium">
              Domain Suggestions{" "}
              {alternatives.length > 0 && `(${alternatives.length})`}
            </h3>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {exactMatch && !exactMatch.available && (
              <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-md text-sm text-red-600">
                ❌ <strong>{exactMatch.domain}</strong> is already taken.
                <br />
                Try one of the available alternatives below
              </div>
            )}

            {exactMatch && exactMatch.available && (
              <DomainCard domain={exactMatch} onSelect={handleSelectDomain} />
            )}

            {alternatives.map((item) => (
              <DomainCard
                key={item.domain}
                domain={item}
                onSelect={handleSelectDomain}
              />
            ))}

            {(loading || geoLoading) && (
              <div className="flex items-center justify-center py-6">
                <span>Loading...</span>
              </div>
            )}

            {!loading && !geoLoading && suggestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground h-full flex items-center justify-center">
                <p className="text-sm">
                  {keyword
                    ? "No available domains found"
                    : "Search for domains to get started"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t bg-muted/30 shrink-0 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
