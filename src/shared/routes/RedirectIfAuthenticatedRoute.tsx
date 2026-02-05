"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../session";

export const RedirectIfAuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticated, loading, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      const role = session?.user?.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [authenticated, loading, router, session]);
  if (loading || authenticated) return null;

  return <>{children}</>;
};
