"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Info } from "lucide-react";
import { useDomains } from "./hooks/useDomains";
import { DomainList } from "./ui/DomainList";
import { DomainTransferDialog } from "./ui/DomainTransferDialog";

export default function DomainsPage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredDomains,
    transferDialogOpen,
    selectedDomain,
    handleTransferRequest,
    submitTransferRequest,
    setTransferDialogOpen,
  } = useDomains();

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Domains</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage domains purchased and connected through Sencill AI
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
        <Info className="size-4 mt-0.5 text-muted-foreground" />
        <p className="text-muted-foreground">
          Domain transfers are handled manually. If you request a transfer, our
          team will unlock the domain and provide you with an authorization
          (EPP) code to complete the transfer at your new registrar.
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search domains..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      {/* Domains List */}
      <DomainList
        domains={filteredDomains}
        onRequestTransfer={handleTransferRequest}
      />

      {/* Transfer Request Dialog */}
      <DomainTransferDialog
        open={transferDialogOpen}
        domain={selectedDomain}
        onClose={() => setTransferDialogOpen(false)}
        onSubmit={submitTransferRequest}
      />
    </div>
  );
}
