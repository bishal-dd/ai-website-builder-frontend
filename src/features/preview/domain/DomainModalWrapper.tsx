"use client";

import { DomainModal } from "@/features/preview/domain/DomainModal";
import type { DomainContact } from "@/features/preview/domain/types/domain";
import { useSession } from "@/shared/session";
import useGetWebsiteDetails from "./hooks/useGetWebsiteDetails";

interface DomainModalWrapperProps {
  websiteId: string;
  onClose?: () => void;
}

export function DomainModalWrapper({
  websiteId,
  onClose,
}: DomainModalWrapperProps) {
  const { user } = useSession();
  const userId = user?.id;

  const { data: websiteData, isLoading } = useGetWebsiteDetails(websiteId);

  const isImported = websiteData?.type === "imported";

  const contact: DomainContact = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "12345678",
    address: "Thimphu",
    city: "Thimphu",
    state: "Thimphu",
    zip: "11001",
    country: "BT",
  };

  if (isLoading) {
    return null;
  }

  return (
    <DomainModal
      onClose={onClose ?? (() => {})}
      contact={contact}
      websiteId={websiteId}
      userId={userId || "anonymous"}
      isImported={isImported} // Pass this down if your DomainModal supports it
    />
  );
}
