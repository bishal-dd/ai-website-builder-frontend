import { DomainModalWrapper } from "@/features/preview/domain/DomainModalWrapper";
import { ProtectedRoute } from "@/shared/routes";
import React from "react";

export default function DomainPage() {
  return (
    <ProtectedRoute>
      <DomainModalWrapper />
    </ProtectedRoute>
  );
}
