"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/shared/session";
import { GeoProvider } from "@/features/preview/domain/hooks/useGeoContext";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PostHogIdentify } from "@/shared/posthog/IdentifyUser";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always", // or 'always' to create profiles for anonymous users as well
  });
}
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <>
      <GeoProvider>
        <PostHogProvider client={posthog}>
          <PostHogIdentify />
          <QueryClientProvider client={queryClient}>
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </GeoProvider>
    </>
  );
}
