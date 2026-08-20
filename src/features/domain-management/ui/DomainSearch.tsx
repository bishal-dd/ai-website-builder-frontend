"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import posthog from "posthog-js";

import { useDomainModal } from "@/features/preview/domain/hooks/useDomainModal";
import { useGeo } from "@/features/preview/domain/hooks/useGeoContext";
import {
  DomainSuggestion,
  SelectedDomain,
} from "@/features/preview/domain/types/domain";
import { createPreOrder } from "@/features/preview/domain/api/domainService";
import { SearchInput } from "@/features/preview/domain/ui/SearchInput";
import { useSession } from "@/shared/session";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardDomainCard } from "./DashboardDomainCard";
import { DomainPaymentSummary } from "./DomainPaymentSummary";

export function DomainSearch() {
  const { user } = useSession();
  const userId = user?.id;
  const {
    keyword,
    setKeyword,
    suggestions,
    loading: searchLoading,
    searchDomain,
  } = useDomainModal();

  const { country: countryCode, loading: geoLoading } = useGeo();

  const [selectedDomain, setSelectedDomain] = useState<SelectedDomain | null>(
    null,
  );

  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loading = searchLoading || geoLoading || actionLoading;

  const cleanKeyword = keyword.trim().toLowerCase();

  const exactMatch = suggestions.find(
    (domain) => domain.domain.toLowerCase() === cleanKeyword,
  );

  const alternatives = suggestions.filter(
    (domain) =>
      domain.domain.toLowerCase() !== cleanKeyword && domain.available,
  );

  const reserveDomain = async (domain: DomainSuggestion) => {
    if (!countryCode) {
      throw new Error("Country information is unavailable");
    }

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const result = await createPreOrder({
      name: domain.domain,
      userId,
      country: countryCode,
    });

    const domainData = result.domain ?? result;
    const pricingData = result.pricing ?? result;

    return {
      id: domainData.id,
      domain: domainData.name,
      price: pricingData.domainPrice ?? domain.price,
      hostingPrice: pricingData.hostingPrice ?? 0,
      websitePrice: pricingData.websitePrice ?? 0,
      currency: pricingData.currency ?? domain.currency,
    } satisfies SelectedDomain;
  };

  const handleBuyNow = async (domain: DomainSuggestion) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);

      const reservedDomain = await reserveDomain(domain);
      await queryClient.invalidateQueries({
        queryKey: ["domains"],
      });

      setSelectedDomain(reservedDomain);
      setShowPayment(true);

      posthog.capture("domain_selected", {
        domain: reservedDomain.domain,
        domain_price: reservedDomain.price,
        country_code: countryCode,
        currency: reservedDomain.currency,
        source: "domain_dashboard",
        purchase_intent: "buy_now",
      });
    } catch (error) {
      console.error("Failed to reserve domain:", error);

      setError("Failed to reserve this domain. Please try again.");

      posthog.captureException(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveForDeployment = async (domain: DomainSuggestion) => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage(null);

      await reserveDomain(domain);

      await queryClient.invalidateQueries({
        queryKey: ["domains"],
      });

      setSuccessMessage(`${domain.domain} has been saved for deployment.`);

      posthog.capture("domain_saved_for_deployment", {
        domain: domain.domain,
        domain_price: domain.price,
        country_code: countryCode,
        currency: domain.currency,
      });
    } catch (error) {
      console.error("Failed to save domain:", error);

      setError("Failed to save this domain. Please try again.");

      posthog.captureException(error);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * WhatsApp payment
   */
  const handleWhatsAppPayment = () => {
    if (!selectedDomain) return;

    const domainPrice = selectedDomain.price;
    const total = domainPrice;

    posthog.capture("payment_initiated", {
      payment_method: "whatsapp",
      payment_type: "domain",
      domain: selectedDomain.domain,
      domain_price: domainPrice,
      total_amount: total,
      currency: selectedDomain.currency,
      source: "domain_dashboard",
    });

    const message = encodeURIComponent(
      `Hi! I'd like to purchase a domain:

Domain: ${selectedDomain.domain}
Total Price: ${domainPrice}
Currency: ${selectedDomain.currency}
`,
    );

    window.open(`https://wa.me/17959259?text=${message}`, "_blank");
  };

  /**
   * International payment
   */
  const handleInternationalPayment = async () => {
    if (!selectedDomain) return;

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
      source: "domain_dashboard",
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/one-time-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          domain: selectedDomain.domain,
          domainPrice: selectedDomain.price,
          customerEmail: user?.email,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();

      console.error("Backend error:", text);

      const error = new Error(`Payment request failed: ${text}`);

      posthog.captureException(error);

      throw error;
    }

    const data = await res.json();

    window.location.href = data.url;
  };

  /**
   * Payment screen
   */
  if (showPayment && selectedDomain) {
    return (
      <DomainPaymentSummary
        selectedDomain={selectedDomain}
        onClose={() => {
          setShowPayment(false);
          setSelectedDomain(null);
        }}
        onBack={() => {
          setShowPayment(false);
        }}
        handleWhatsAppPayment={handleWhatsAppPayment}
        handleInternationalPayment={handleInternationalPayment}
        countryCode={countryCode}
      />
    );
  }

  return (
    <section className="w-full space-y-5 rounded-2xl border bg-card p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Search for a domain</h2>

        <p className="text-sm text-muted-foreground">
          Find the perfect domain for your website.
        </p>
      </div>
      <SearchInput
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={searchDomain}
        loading={searchLoading || geoLoading}
      />
      <div className="text-xs text-muted-foreground">
        Search in this format, e.g. <strong>example.com</strong>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}
      <div className="space-y-2">
        {exactMatch && !exactMatch.available && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
            <strong>{exactMatch.domain}</strong> is already taken. Try one of
            the available alternatives below.
          </div>
        )}

        {exactMatch?.available && (
          <DashboardDomainCard
            domain={exactMatch}
            onBuyNow={handleBuyNow}
            onSaveForDeployment={handleSaveForDeployment}
            disabled={loading}
          />
        )}

        {alternatives.map((domain) => (
          <DashboardDomainCard
            key={domain.domain}
            domain={domain}
            onBuyNow={handleBuyNow}
            onSaveForDeployment={handleSaveForDeployment}
            disabled={loading}
          />
        ))}

        {searchLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}

        {!searchLoading && suggestions.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {keyword
              ? "No available domains found"
              : "Search for a domain to get started"}
          </div>
        )}
      </div>
    </section>
  );
}
