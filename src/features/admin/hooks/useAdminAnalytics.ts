import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  AdminAnalyticsResponse,
} from "../api/getAdminAnalytics";

const useAdminAnalytics = () => {
  const { data, isLoading, error, refetch } = useQuery<AdminAnalyticsResponse>({
    queryKey: ["admin-analytics"],

    queryFn: () => getAdminAnalytics(),

    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: data?.stats,
    countries: data?.countries ?? [],
    isLoading,
    error,
    refetch,
  };
};

export default useAdminAnalytics;
