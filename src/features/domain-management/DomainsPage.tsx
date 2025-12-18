"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DomainTransferDialog } from "./ui/DomainTransferDialog";
import { useDomains } from "./hooks/useDomains";
import { DomainList } from "./ui/DomainList";

export default function DomainsPage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredDomains,
    transferDialogOpen,
    selectedDomain,
    handleTransfer,
    submitTransfer,
    setTransferDialogOpen,
  } = useDomains();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Domains</h1>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Domain
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search domains..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Domains List */}
      <DomainList domains={filteredDomains} onTransfer={handleTransfer} />

      {/* Transfer Dialog */}
      <DomainTransferDialog
        open={transferDialogOpen}
        domain={selectedDomain}
        onClose={() => setTransferDialogOpen(false)}
        onSubmit={submitTransfer}
      />
    </div>
  );
}
