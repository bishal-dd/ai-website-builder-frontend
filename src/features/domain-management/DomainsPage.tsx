"use client";

import { useState } from "react";
import { Sparkles, Loader2, Globe } from "lucide-react";

import { useGetDomains } from "./hooks/useGetDomains";
import { useTransferDomain } from "./hooks/useTransferDomain";
import { DomainTransferDialog } from "./ui/DomainTransferDialog";
import { DomainList } from "./ui/DomainList";
import { useSessionStore } from "@/shared/session";
import { Domain } from "./types/domain";

export default function DomainsPage() {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const { domains, isLoading } = useGetDomains();
  const { mutate: transfer, isPending: isSubmitting } = useTransferDomain();
  const userEmail = useSessionStore((state) => state.session?.user.email);

  const handleInitiateClick = (domain: Domain) => {
    setSelectedDomain(domain);
    setTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!selectedDomain || !userEmail) return;

    transfer(
      {
        domainId: selectedDomain.id,
        domainName: selectedDomain.name,
        userEmail,
      },
      {
        onSuccess: () => {
          setTransferDialogOpen(false);
          setSelectedDomain(null);
        },
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase">
          <Sparkles className="size-4" />
          Workspace Assets
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight">Your Domains</h1>

        <p className="text-muted-foreground text-lg">
          Manage your digital identity and registrar connections.
        </p>
      </div>

      {/* Domain List / Loading State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Registered Assets ({domains.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 border border-dashed rounded-3xl bg-muted/30">
            <Loader2 className="size-8 animate-spin text-primary/60" />
            <p className="text-sm text-muted-foreground font-medium text-center">
              Fetching your domain assets...
            </p>
          </div>
        ) : domains.length > 0 ? (
          <DomainList
            domains={domains}
            onInitiateTransfer={handleInitiateClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-muted/30 text-center px-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Globe className="size-6 text-muted-foreground/60" />
            </div>

            <p className="font-bold text-lg">No domains found</p>

            <p className="text-sm text-muted-foreground">
              Purchase a new domain to see it here.
            </p>
          </div>
        )}
      </div>

      <DomainTransferDialog
        open={transferDialogOpen}
        domain={selectedDomain}
        isLoading={isSubmitting}
        onClose={() => setTransferDialogOpen(false)}
        onConfirm={handleConfirmTransfer}
      />
    </div>
  );
}
