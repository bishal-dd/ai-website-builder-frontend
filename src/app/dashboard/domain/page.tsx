import DomainsPage from "@/features/domain-management/DomainsPage";
import { ProtectedRoute } from "@/shared/routes";
import React from "react";

export default function DomainManagementPage() {
  return (
    <ProtectedRoute>
      <DomainsPage />
    </ProtectedRoute>
  );
}
