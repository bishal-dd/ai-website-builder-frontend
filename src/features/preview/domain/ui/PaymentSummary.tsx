"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SelectedDomain, DomainContact } from "../types/domain";
import { useWebsiteDeploymentStatus } from "../hooks/useWebsiteDeploymentStatus";

interface PaymentSummaryProps {
  websiteId: string;
  selectedDomain: SelectedDomain;
  contact: DomainContact;
  onClose: () => void;
  onBack: () => void;
  handleWhatsAppPayment: () => void;
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
  const { status, setStatus, progress } = useWebsiteDeploymentStatus(
    websiteId!,
  );

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
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Selected Domain</span>
              <span>{selectedDomain.domain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Domain Registration (per year)</span>
              <span>{formatPrice(selectedDomain.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hosting Service (per year)</span>
              <span>{formatPrice(hostingPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Website Generation</span>
              <span>{formatPrice(websitePrice)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-shadow-primary-foreground">
              <span>Total Amount</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* STATUS / LOADING */}
        {status !== "awaiting_payment" && (
          <div className="p-6 flex flex-col items-center gap-3">
            {status === "pending_approval" && (
              <div className="flex items-center gap-2 text-yellow-500">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Waiting for admin approval...</span>
              </div>
            )}
            {status === "deploying" && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                <span>Deployment in progress...</span>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {status === "completed" && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle />
                <span>Website deployed successfully!</span>
              </div>
            )}
            {status === "failed" && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle />
                <span>Deployment failed. Contact support.</span>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        {status === "awaiting_payment" && (
          <div className="p-6 flex flex-col gap-3">
            {countryCode === "BT" ? (
              <Button
                onClick={() => {
                  handleWhatsAppPayment();
                  setStatus("pending_approval");
                }}
                className="w-full"
              >
                Contact via WhatsApp
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleInternationalPayment();
                  setStatus("pending_approval");
                }}
                className="w-full"
              >
                Pay with Card
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
