"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { SelectedDomain, DomainContact } from "../types/domain";
import { useWebsiteDeploymentStatus } from "../hooks/useWebsiteDeploymentStatus";

interface PaymentSummaryProps {
  websiteId: string;
  selectedDomain: SelectedDomain;
  contact: DomainContact;
  onClose: () => void;
  onBack: () => void;
  handleWhatsAppPayment: (paymentType?: "full" | "installments") => void;
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

  const [paymentType, setPaymentType] = useState<"full" | "installments">(
    "full",
  );

  const hostingPrice = selectedDomain.hostingPrice ?? 0;
  const websitePrice = selectedDomain.websitePrice ?? 0;
  const domainPrice = selectedDomain.price ?? 0;

  const totalPrice = domainPrice + hostingPrice + websitePrice;

  // 👉 Installment config (you can change this)
  const installmentMonths = 4;

  const firstInstallment = domainPrice; // upfront
  const remainingAmount = Math.max(totalPrice - firstInstallment, 0);
  const monthlyPayment =
    installmentMonths > 0 ? Math.ceil(remainingAmount / installmentMonths) : 0;

  const formatPrice = (price: number) =>
    countryCode === "BT" ? `Nu. ${price}` : `$${price.toFixed(2)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
      flex items-end sm:items-center justify-center"
    >
      {" "}
      <div
        className="
        bg-background w-full sm:max-w-md
        h-[100dvh] sm:h-auto sm:max-h-[90vh]
        sm:rounded-lg border shadow-lg
        flex flex-col overflow-hidden
      "
      >
        {" "}
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
              <span>{selectedDomain.domain}</span>
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
              <span>Website Generation</span>
              <span>{formatPrice(websitePrice)}</span>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span>Total Amount</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* 🔥 Payment options for BT */}
            {countryCode === "BT" && (
              <div className="mt-4 space-y-3 rounded-lg border p-4">
                <p className="text-sm font-medium">Choose payment option:</p>

                <div className="space-y-2">
                  {/* FULL */}
                  <button
                    onClick={() => setPaymentType("full")}
                    className={`w-full text-left p-3 rounded-md border ${
                      paymentType === "full"
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">Pay Full Amount</div>
                    <div className="text-sm text-muted-foreground">
                      Pay {formatPrice(totalPrice)} now
                    </div>
                  </button>

                  {/* INSTALLMENTS */}
                  <button
                    onClick={() => setPaymentType("installments")}
                    className={`w-full text-left p-3 rounded-md border ${
                      paymentType === "installments"
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">Pay in Installments</div>
                    <div className="text-sm text-muted-foreground">
                      First payment: {formatPrice(firstInstallment)} (domain)
                      <br />
                      Remaining: {formatPrice(remainingAmount)}
                      <br />
                      {formatPrice(monthlyPayment)} / month for{" "}
                      {installmentMonths} months
                    </div>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  *Domain is paid upfront. Monthly payments start after your
                  website is delivered.
                </p>
              </div>
            )}

            <div className="text-sm mt-4">
              {countryCode === "BT"
                ? `*Once we verify your first payment on WhatsApp, we’ll deploy your website and you will receive your website link in your email when it goes live.`
                : `*Once you complete your payment, you’ll receive your website link when it goes live.`}
            </div>
          </div>
        </div>
        {/* ACTION */}
        <div className="p-6 flex flex-col gap-3">
          {countryCode === "BT" ? (
            <Button
              onClick={() => {
                handleWhatsAppPayment(paymentType);
                setStatus("pending_approval");
              }}
              className="w-full"
            >
              Continue on WhatsApp{" "}
              {paymentType === "full"
                ? `(${formatPrice(totalPrice)})`
                : `(${formatPrice(firstInstallment)} now)`}
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
