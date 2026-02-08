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
import { createPreOrder } from "./api/domainService";
import { useSession } from "@/shared/session";
import posthog from "posthog-js";

interface DomainModalProps {
  onClose: () => void;
  contact: DomainContact;
  websiteId: string;
  userId: string;
}

export function DomainModal({
  onClose,
  contact,
  websiteId,
  userId,
}: DomainModalProps) {
  const { user } = useSession();
  const [step, setStep] = useState<"selection" | "pricing">("selection");
  const [selectedDomain, setSelectedDomain] = useState<SelectedDomain | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { country: countryCode, loading: geoLoading } = useGeo();
  const {
    keyword,
    setKeyword,
    suggestions,
    loading: searchLoading,
    searchDomain,
  } = useDomainModal();

  // ✅ Handle domain selection
  const handleSelectDomain = async (domain: DomainSuggestion) => {
    if (geoLoading) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createPreOrder({
        name: domain.domain,
        websiteId,
        userId,
      });

      setSuccessMessage(`✅ Domain ${domain.domain} reserved successfully!`);

      const hostingPrice = countryCode === "BT" ? 3000 : 33;
      const websitePrice = countryCode === "BT" ? 7000 : 79.99;

      setSelectedDomain({
        domain: domain.domain,
        price: domain.price,
        hostingPrice,
        websitePrice,
        currency: countryCode === "BT" ? "BTN" : "USD",
      });

      // Capture domain selected event
      posthog.capture("domain_selected", {
        domain: domain.domain,
        domain_price: domain.price,
        website_id: websiteId,
        country_code: countryCode,
        currency: countryCode === "BT" ? "BTN" : "USD",
      });

      setStep("pricing");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to reserve domain. Try again.");
      posthog.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => setStep("selection");

  // WhatsApp payment
  const handleWhatsAppPayment = () => {
    if (!selectedDomain) return;

    const total =
      selectedDomain.price +
      (selectedDomain.hostingPrice ?? 0) +
      (selectedDomain.websitePrice ?? 0);

    // Capture payment initiated event
    posthog.capture("payment_initiated", {
      payment_method: "whatsapp",
      domain: selectedDomain.domain,
      domain_price: selectedDomain.price,
      hosting_price: selectedDomain.hostingPrice,
      website_price: selectedDomain.websitePrice,
      total_amount: total,
      currency: selectedDomain.currency,
      website_id: websiteId,
    });

    const message = encodeURIComponent(
      `Hi! I'd like to purchase:

  Website ID: ${websiteId}

  Domain: ${selectedDomain.domain}
  Domain Price: ${selectedDomain.price}
  Hosting: ${selectedDomain.hostingPrice}
  Website Generation: ${selectedDomain.websitePrice}
  Total: ${total}`,
    );

    window.open(`https://wa.me/17959259?text=${message}`);
  };

  // Payment placeholder
  const handleInternationalPayment = async () => {
    // Capture payment initiated event for international payment
    if (selectedDomain) {
      const total =
        selectedDomain.price +
        (selectedDomain.hostingPrice ?? 0) +
        (selectedDomain.websitePrice ?? 0);

      posthog.capture("payment_initiated", {
        payment_method: "international",
        domain: selectedDomain.domain,
        domain_price: selectedDomain.price,
        hosting_price: selectedDomain.hostingPrice,
        website_price: selectedDomain.websitePrice,
        total_amount: total,
        currency: selectedDomain.currency,
        website_id: websiteId,
      });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/one-time-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId,
          domain: selectedDomain?.domain,
          domainPrice: selectedDomain?.price,
          customerEmail: user?.email,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      posthog.captureException(new Error(`Payment request failed: ${text}`));
      throw new Error("Payment request failed");
    }

    const data = await res.json();
    window.location.href = data.url;
  };
  // Payment step
  if (step === "pricing" && selectedDomain) {
    return (
      <PaymentSummary
        websiteId={websiteId}
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
    (s) => s.domain.toLowerCase() === cleanKeyword.toLowerCase(),
  );
  const alternatives = suggestions.filter(
    (s) => s.domain !== cleanKeyword && s.available,
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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* SEARCH */}
        <div className="p-4 space-y-3 shrink-0">
          <SearchInput
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={searchDomain}
            loading={searchLoading || geoLoading}
          />
          {error && <ErrorMessage message={error} />}
          {successMessage && (
            <div className="text-green-600 text-sm">{successMessage}</div>
          )}
          <div className="text-gray-500 text-sm">
            only international TLDs are available (.com, .travel, .ai, .io, .us,
            .uk)
          </div>
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
                <br /> Try one of the available alternatives below
              </div>
            )}

            {exactMatch && exactMatch.available && (
              <DomainCard
                domain={exactMatch}
                onSelect={handleSelectDomain}
                disabled={loading}
              />
            )}

            {alternatives.map((item) => (
              <DomainCard
                key={item.domain}
                domain={item}
                onSelect={handleSelectDomain}
                disabled={loading}
              />
            ))}

            {(searchLoading || geoLoading) && (
              <div className="flex items-center justify-center py-6">
                <span>Loading...</span>
              </div>
            )}

            {!searchLoading && !geoLoading && suggestions.length === 0 && (
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
