"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { SelectedDomain, DomainContact } from "../types/domain";

interface PaymentSummaryProps {
  selectedDomain: SelectedDomain;
  contact: DomainContact;
  onClose: () => void;
  onBack: () => void;
  handleWhatsAppPayment: () => void;
  handleInternationalPayment: () => void;
  countryCode: string;
}

export function PaymentSummary({
  selectedDomain,
  onClose,
  onBack,
  handleWhatsAppPayment,
  handleInternationalPayment,
  countryCode,
}: PaymentSummaryProps) {
  const hostingPrice = selectedDomain.hostingPrice ?? 0;
  const websitePrice = selectedDomain.websitePrice ?? 0;
  const totalPrice = selectedDomain.price + hostingPrice + websitePrice;

  const formatPrice = (price: number) =>
    countryCode === "BT" ? `Nu. ${price}` : `$${price.toFixed(2)}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">Payment Summary</h2>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* PRICING */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Selected Domain</span>
              <span>{selectedDomain.domain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Domain Registration (1 year)</span>
              <span>{formatPrice(selectedDomain.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hosting Service</span>
              <span>{formatPrice(hostingPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Website Generation</span>
              <span>{formatPrice(websitePrice)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-primary">
              <span>Total Amount</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-6 flex flex-col gap-3">
          {countryCode === "BT" ? (
            <Button onClick={handleWhatsAppPayment} className="w-full">
              Contact via WhatsApp
            </Button>
          ) : (
            <Button onClick={handleInternationalPayment} className="w-full">
              Pay with Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
