"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";

import { useGetDomains } from "./hooks/useGetDomains";
import { useTransferDomain } from "./hooks/useTransferDomain";
import { DomainTransferDialog } from "./ui/DomainTransferDialog";
import { DomainList } from "./ui/DomainList";
import { useSessionStore } from "@/shared/session";
import { Domain } from "./types/domain";
import { DomainSearch } from "./ui/DomainSearch";

export default function DomainsPage() {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const { domains, isLoading } = useGetDomains();

  const { mutate: transfer, isPending: isSubmitting } = useTransferDomain();

  const userEmail = useSessionStore((state) => state.session?.user.email);

  const handleInitiateTransfer = (domain: Domain) => {
    setSelectedDomain(domain);
    setTransferDialogOpen(true);
  };

  const handleCloseTransferDialog = () => {
    setTransferDialogOpen(false);
    setSelectedDomain(null);
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
        onSuccess: handleCloseTransferDialog,
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-8 md:px-10">
      {/* Header */}
      <header className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Your Domains</h1>

        <p className="mt-2 text-muted-foreground">
          Search, manage, and transfer your domains.
        </p>
      </header>

      {/* Domain Search */}
      <section className="mx-auto w-full max-w-4xl">
        <DomainSearch />
      </section>

      {/* Registered Domains */}
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Registered Assets ({domains.length})
          </h2>
        </div>

        {isLoading ? (
          <DomainListLoading />
        ) : domains.length > 0 ? (
          <DomainList
            domains={domains}
            onInitiateTransfer={handleInitiateTransfer}
          />
        ) : (
          <EmptyDomainState />
        )}
      </section>

      {/* Transfer Dialog */}
      <DomainTransferDialog
        open={transferDialogOpen}
        domain={selectedDomain}
        isLoading={isSubmitting}
        onClose={handleCloseTransferDialog}
        onConfirm={handleConfirmTransfer}
      />
    </div>
  );
}

function DomainListLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed bg-muted/30 py-20">
      <Loader2 className="size-8 animate-spin text-primary/60" />

      <p className="text-center text-sm font-medium text-muted-foreground">
        Fetching your domain assets...
      </p>
    </div>
  );
}

function EmptyDomainState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/30 px-4 py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Globe className="size-6 text-muted-foreground/60" />
      </div>

      <p className="text-lg font-bold">No domains found</p>

      <p className="text-sm text-muted-foreground">
        Search for a domain above to get started.
      </p>
    </div>
  );
}
