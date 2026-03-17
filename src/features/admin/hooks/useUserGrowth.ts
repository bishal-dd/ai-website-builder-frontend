import { useQuery } from "@tanstack/react-query";
import { getUserGrowths } from "../api/getUserGrowth";

const useUserGrowth = (start?: string, end?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-user-analytics", { start, end }],
    queryFn: () => getUserGrowths(start, end),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data ?? [],
    isLoading,
    error,
    refetch,
  };
};

export default useUserGrowth;
