"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { SelectedDomain, DomainContact } from "../types/domain";
import { useWebsiteDeploymentStatus } from "../hooks/useWebsiteDeploymentStatus";

interface PaymentSummaryProps {
  websiteId?: string;
  selectedDomain: SelectedDomain;
  contact?: DomainContact;
  onClose: () => void;
  onBack: () => void;
  handleWhatsAppPayment: () => void; // Updated type
  handleInternationalPayment: () => void;
  countryCode: string;
}

export function PaymentSummary({
  websiteId,
  selectedDomain,
  onClose,
  onBack,
  handleWhatsAppPayment,
  handleInternationalPayment,
  countryCode,
}: PaymentSummaryProps) {
  const { setStatus } = useWebsiteDeploymentStatus(websiteId!);

  const hostingPrice = selectedDomain.hostingPrice ?? 0;
  const websitePrice = selectedDomain.websitePrice ?? 0;
  const domainPrice = selectedDomain.price ?? 0;

  const totalPrice = domainPrice + hostingPrice + websitePrice;

  const formatPrice = (price: number) =>
    countryCode === "BT" ? `Nu. ${price}` : `$${price.toFixed(2)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
      flex items-end sm:items-center justify-center"
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

        {/* PRICING */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Selected Domain</span>
              <span className="font-medium">{selectedDomain.domain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Domain Registration (per year)</span>
              <span>{formatPrice(domainPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hosting Service (per year)</span>
              <span>{formatPrice(hostingPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Website Generation (one time)</span>
              <span>{formatPrice(websitePrice)}</span>
            </div>

            <div className="flex items-center justify-between font-bold text-lg pt-2 border-t">
              <span>Total Amount</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="text-sm mt-6 text-muted-foreground">
              {countryCode === "BT"
                ? `*Once we verify your payment on WhatsApp, we’ll deploy your website and you will receive your website link in your email when it goes live.`
                : `*Once you complete your payment, you’ll receive your website link when it goes live.`}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="p-6 flex flex-col gap-3">
          {countryCode === "BT" ? (
            <Button
              onClick={() => {
                handleWhatsAppPayment();
                setStatus("pending_approval");
              }}
              className="w-full"
            >
              Pay Full Amount ({formatPrice(totalPrice)})
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleInternationalPayment();
                setStatus("pending_approval");
              }}
              className="w-full"
            >
              Pay {formatPrice(totalPrice)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
