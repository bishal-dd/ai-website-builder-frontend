"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../session";

export const RedirectIfAuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      router.push("/dashboard");
    }
  }, [authenticated, loading, router]);

  if (loading || authenticated) return null;

  return <>{children}</>;
};
