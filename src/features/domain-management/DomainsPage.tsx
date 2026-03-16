"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Info, Search, Sparkles, Loader2, Globe } from "lucide-react";
import { useGetDomains } from "./hooks/useGetDomains";
import { useTransferDomain } from "./hooks/useTransferDomain";
import { DomainTransferDialog } from "./ui/DomainTransferDialog";
import { DomainList } from "./ui/DomainList";
import { useSessionStore } from "@/shared/session";
import { Domain } from "./types/domain";

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const { domains, isLoading } = useGetDomains();
  const { mutate: transfer, isPending: isSubmitting } = useTransferDomain();
  const userEmail = useSessionStore((state) => state.session?.user.email);

  const filteredDomains = useMemo(() => {
    return domains.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [domains, searchQuery]);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase">
            <Sparkles className="size-4" />
            Workspace Assets
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Your Domains
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your digital identity and registrar connections.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20 bg-background/50 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="group relative rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/[0.04] to-transparent p-6 transition-all hover:border-primary/20">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <Info className="size-5" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-foreground/90">
              Concierge Domain Management
            </h4>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Domain security is our priority. Transfers are handled manually by
              our senior engineers to prevent unauthorized hijacking.
            </p>
          </div>
        </div>
      </div>

      {/* Domain List / Loading State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Registered Assets ({filteredDomains.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 border border-dashed rounded-3xl bg-muted/30">
            <Loader2 className="size-8 animate-spin text-primary/60" />
            <p className="text-sm text-muted-foreground font-medium text-center">
              Fetching your domain assets...
            </p>
          </div>
        ) : filteredDomains.length > 0 ? (
          <DomainList
            domains={filteredDomains}
            onInitiateTransfer={handleInitiateClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-muted/30 text-center px-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Globe className="size-6 text-muted-foreground/60" />
            </div>
            <p className="font-bold text-lg">No domains found</p>
            <p className="text-sm text-muted-foreground">
              Try a different search or purchase a new domain.
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
