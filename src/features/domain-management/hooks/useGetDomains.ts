import { useQuery } from "@tanstack/react-query";
import { getUserDomains } from "../api/getUserDomains";

export const useGetDomains = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["domains"],
    queryFn: () => getUserDomains(),
    staleTime: 1000 * 60,
  });

  return {
    domains: data ?? [],
    isLoading,
    error,
  };
};
