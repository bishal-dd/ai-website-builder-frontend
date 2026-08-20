import { useQuery } from "@tanstack/react-query";
import { InsightWebsite } from "../types";
import { getWebsitesInsight } from "../api/getWebsitesInsight";

export function useWebsitesInsight() {
  const { data, isLoading, error } = useQuery<InsightWebsite[], Error>({
    queryKey: ["websites-insight"],
    queryFn: getWebsitesInsight,
    staleTime: 0,
    refetchInterval: 30_000,
    retry: 1,
  });

  return {
    websites: data ?? [],
    isLoading,
    error,
  };
}
