"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../session";

export const RedirectIfAuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticated, loading, session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading || !authenticated) {
      return;
    }

    const creationIntent = searchParams.get("intent");
    const creationData = searchParams.get("data");

    if (creationIntent === "create" && creationData) {
      const wizardUrl = new URL("/wizard", window.location.origin);
      wizardUrl.searchParams.set("data", creationData);

      router.replace(wizardUrl.toString());
      return;
    }

    const role = session?.user?.role;

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/dashboard");
    }
  }, [authenticated, loading, router, searchParams, session]);

  if (loading || authenticated) {
    return null;
  }

  return <>{children}</>;
};
