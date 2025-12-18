"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Domain } from "../types/domain";
import { mockDomains } from "../data/mockDomains";

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [searchQuery, setSearchQuery] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  // Filtered domains based on search
  const filteredDomains = useMemo(
    () =>
      domains.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [domains, searchQuery]
  );

  // Open transfer dialog
  const handleTransfer = (domain: Domain) => {
    setSelectedDomain(domain);
    setTransferDialogOpen(true);
  };

  // Submit transfer
  const submitTransfer = (domain: Domain, code: string) => {
    if (!code) {
      toast.error("Please enter the authorization code");
      return;
    }

    // Call your API here
    toast.success(
      `Transfer request for ${domain.name} submitted successfully.`
    );

    setTransferDialogOpen(false);
    setSelectedDomain(null);
  };

  return {
    domains,
    searchQuery,
    setSearchQuery,
    filteredDomains,
    transferDialogOpen,
    selectedDomain,
    handleTransfer,
    submitTransfer,
    setTransferDialogOpen,
    setDomains,
  };
}
