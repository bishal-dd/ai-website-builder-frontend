"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X, CreditCard, MessageCircle } from "lucide-react";
import { Separator } from "../ui/Separator";
import { DomainContact, SelectedDomain } from "../types/domain";

interface PaymentSummaryProps {
  selectedDomain: SelectedDomain;
  contact: DomainContact;
  onClose: () => void;
  onBack: () => void;
  formatPrice: (price: number) => string;
  handleWhatsAppPayment: () => void;
  handleInternationalPayment: () => void;
}

export function PaymentSummary({
  selectedDomain,
  contact,
  onClose,
  onBack,
  formatPrice,
  handleWhatsAppPayment,
  handleInternationalPayment,
}: PaymentSummaryProps) {
  const hostingPrice = 9.99;
  const websiteGenerationPrice = 49.99;
  const totalPrice =
    selectedDomain.price + hostingPrice + websiteGenerationPrice;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
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
            <h2 className="text-lg font-semibold">Payment Summary</h2>
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

        {/* Pricing Details */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Selected Domain
              </span>
              <span className="font-medium">{selectedDomain.domain}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Domain Registration (1 year)</span>
              <span className="font-medium">
                {formatPrice(selectedDomain.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Hosting Service (Monthly)</span>
              <span className="font-medium">{formatPrice(hostingPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Website Generation</span>
              <span className="font-medium">
                {formatPrice(websiteGenerationPrice)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              Currency: {selectedDomain.currency} • Contact: {contact.email}
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleInternationalPayment}
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay with Card
            </Button>
            <Button
              onClick={handleWhatsAppPayment}
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
