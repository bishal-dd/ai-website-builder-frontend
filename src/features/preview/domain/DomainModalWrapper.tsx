"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DomainModal } from "@/features/preview/domain/DomainModal";
import type { DomainContact } from "@/features/preview/domain/types/domain";
import { useSession } from "@/shared/session";
import { useWizardStore } from "@/features/wizard/store/wizardStore";

export function DomainModalWrapper() {
  const [open, setOpen] = useState(true);
  const { websiteId } = useWizardStore();
  const { user } = useSession();
  const userId = user?.id;
  const router = useRouter();

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

  const handleClose = () => {
    setOpen(false);
    router.push(`/preview/${websiteId}`);
  };

  if (!open) return null;

  return (
    <DomainModal
      onClose={handleClose}
      contact={contact}
      websiteId={websiteId || ""}
      userId={userId || "anonymous"}
    />
  );
}
