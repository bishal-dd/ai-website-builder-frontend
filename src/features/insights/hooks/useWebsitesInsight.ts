import { useQuery } from "@tanstack/react-query";
import { InsightWebsite } from "../types";
import { getWebsitesInsight, InsightPeriod } from "../api/getWebsitesInsight";

export function useWebsitesInsight(period: InsightPeriod) {
  const { data, isLoading, error } = useQuery<InsightWebsite[], Error>({
    queryKey: ["websites-insight", period],
    queryFn: () => getWebsitesInsight(period),
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
