"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Domain } from "../types/domain";
import { mockDomains } from "../data/mockDomains";

interface TransferRequestPayload {
  newRegistrar?: string;
  reason?: string;
}

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [searchQuery, setSearchQuery] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  // 🔍 Filter domains
  const filteredDomains = useMemo(
    () =>
      domains.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [domains, searchQuery],
  );

  // 🟡 Open transfer request dialog
  const handleTransferRequest = (domain: Domain) => {
    setSelectedDomain(domain);
    setTransferDialogOpen(true);
  };

  // ✅ Submit transfer request (NO auth code)
  const submitTransferRequest = (
    domain: Domain,
    payload: TransferRequestPayload,
  ) => {
    // In real app → call API here
    // await api.post("/domains/transfer-request", { domainId: domain.id, ...payload })

    setDomains((prev) =>
      prev.map((d) =>
        d.id === domain.id
          ? {
              ...d,
              status: "transfer_requested",
              transferMeta: {
                requestedAt: new Date().toISOString(),
                ...payload,
              },
            }
          : d,
      ),
    );

    toast.success(
      `Transfer request submitted for ${domain.name}. Our team will contact you shortly.`,
    );

    setTransferDialogOpen(false);
    setSelectedDomain(null);
  };

  return {
    // data
    domains,
    filteredDomains,
    selectedDomain,

    // search
    searchQuery,
    setSearchQuery,

    // dialog state
    transferDialogOpen,
    setTransferDialogOpen,

    // actions
    handleTransferRequest,
    submitTransferRequest,

    // utils
    setDomains,
  };
}
