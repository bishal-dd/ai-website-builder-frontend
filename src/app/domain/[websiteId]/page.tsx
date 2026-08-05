"use client";

import { useRouter, useParams } from "next/navigation";
import { DomainModalWrapper } from "@/features/preview/domain/DomainModalWrapper";
import { ProtectedRoute } from "@/shared/routes";

export default function DomainPage() {
  const router = useRouter();
  const { websiteId } = useParams<{ websiteId: string }>();

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DomainModalWrapper websiteId={websiteId} onClose={() => router.back()} />
    </ProtectedRoute>
  );
}
