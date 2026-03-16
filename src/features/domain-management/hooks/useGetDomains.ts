import { useQuery } from "@tanstack/react-query";
import { getUserDomains } from "../api/getUserDomains";

export const useGetDomains = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-domains"],
    queryFn: () => getUserDomains(),
    // Keep data fresh for 1 minute, but allow background refetching
    staleTime: 1000 * 60,
  });

  return {
    domains: data ?? [],
    isLoading,
    error,
  };
};
