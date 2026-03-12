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
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-amber-600 p-8 flex flex-col items-center text-center text-white">
          <div className="size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <ShieldAlert className="size-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Transfer Authorization
          </DialogTitle>
          <p className="text-amber-100 text-sm mt-2 font-medium">
            {domain.name}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <DialogDescription className="text-center text-base text-foreground/80">
            Are you sure you want to request an EPP code? This is the first step
            in moving your domain to a different registrar.
          </DialogDescription>

          <div className="rounded-xl bg-muted/40 border border-muted p-4 space-y-3">
            <div className="flex gap-3">
              <div className="size-8 rounded-lg bg-white border flex items-center justify-center shrink-0 shadow-sm">
                <MailCheck className="size-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  The &quot;Next Step&quot; Email
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We&apos;ll unlock your domain and email the authorization code
                  to your account address within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-between items-center gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground underline-offset-4 hover:underline"
          >
            Go back
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white min-w-[160px] shadow-lg shadow-amber-600/20"
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
