"use client";

import { Button } from "@/components/ui/button";
import { SelectedDomain } from "@/features/preview/domain/types/domain";
import { ArrowLeft, X } from "lucide-react";

interface DomainPaymentSummaryProps {
  selectedDomain: SelectedDomain;
  onClose: () => void;
  onBack: () => void;
  handleWhatsAppPayment: () => void;
  handleInternationalPayment: () => void;
  countryCode: string;
}

export function DomainPaymentSummary({
  selectedDomain,
  onClose,
  onBack,
  handleWhatsAppPayment,
  handleInternationalPayment,
  countryCode,
}: DomainPaymentSummaryProps) {
  const domainPrice = selectedDomain.price ?? 0;

  const formatPrice = (price: number) =>
    countryCode === "BT" ? `Nu. ${price}` : `$${price.toFixed(2)}`;

  return (
    <div
      className="
        fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
        flex items-end sm:items-center justify-center
      "
    >
      <div
        className="
          bg-background w-full sm:max-w-md
          h-[100dvh] sm:h-auto sm:max-h-[90vh]
          sm:rounded-lg border shadow-lg
          flex flex-col overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-lg font-semibold">Domain Payment</h2>
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

        {/* SUMMARY */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Domain</span>

              <span className="font-medium">{selectedDomain.domain}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Domain Registration</span>

              <span className="font-medium">{formatPrice(domainPrice)}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              Domain registration is billed yearly.
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between border-t pt-4 text-lg font-bold">
              <span>Total Amount</span>

              <span>{formatPrice(domainPrice)}</span>
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              {countryCode === "BT"
                ? "Once we verify your payment on WhatsApp, your domain will be processed."
                : "Once your payment is completed, your domain registration will be processed."}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="p-6 flex flex-col gap-3 border-t">
          {countryCode === "BT" ? (
            <Button onClick={handleWhatsAppPayment} className="w-full">
              Pay {formatPrice(domainPrice)}
            </Button>
          ) : (
            <Button onClick={handleInternationalPayment} className="w-full">
              Pay {formatPrice(domainPrice)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
