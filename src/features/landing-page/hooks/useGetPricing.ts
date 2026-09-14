import { useQuery } from "@tanstack/react-query";
import { getPricing } from "../api/getPricing";
import { Pricing } from "../types/pricing";

export function usePricing() {
  const { data, isLoading, error } = useQuery<Pricing, Error>({
    queryKey: ["pricing"],
    queryFn: getPricing,
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    pricing: data,
    isLoading,
    error,
  };
}
