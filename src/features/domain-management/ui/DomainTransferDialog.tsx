"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, MailCheck } from "lucide-react";
import { Domain } from "../types/domain";

interface TransferDialogProps {
  open: boolean;
  domain: Domain | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (domain: Domain) => void;
}

export function DomainTransferDialog({
  open,
  domain,
  isLoading,
  onClose,
  onConfirm,
}: TransferDialogProps) {
  if (!domain) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <div className="bg-primary p-8 flex flex-col items-center text-center text-black">
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 shadow-md">
            <ShieldAlert className="w-8 h-8 text-black" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Transfer Authorization
          </DialogTitle>
          <p className="text-black/80 text-sm mt-2 font-medium">
            {domain.name}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <DialogDescription className="text-center text-base text-black/70">
            Are you sure you want to request a domain transfer?
          </DialogDescription>

          <div className="rounded-xl p-6 bg-yellow-50 border border-yellow-200 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center shadow-inner">
                <MailCheck className="w-6 h-6 text-black" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-black">
                  The &quot;Next Step&quot; Email
                </p>
                <p className="text-sm text-black/70 leading-relaxed">
                  We&apos;ll unlock your domain and email the authorization code
                  to your account address within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-black/60 underline-offset-4 hover:text-black hover:underline"
          >
            Go back
          </Button>
          <Button
            className="bg-primary hover:bg-yellow-400 text-black min-w-[160px] shadow-lg shadow-yellow-300/40 transition-colors duration-200"
            onClick={() => onConfirm(domain)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 italic">
                Processing...
              </span>
            ) : (
              "Confirm Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
