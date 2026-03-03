import { useQuery } from "@tanstack/react-query";
import { getUserGrowths } from "../api/getUserGrowth";

const useUserGrowth = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-user-analytics"],
    queryFn: getUserGrowths,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: data ?? [],
    isLoading,
    error,
    refetch,
  };
};

export default useUserGrowth;
