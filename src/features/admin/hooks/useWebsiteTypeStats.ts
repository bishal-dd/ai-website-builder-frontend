import { useQuery } from "@tanstack/react-query";
import {
  getWebsiteTypeStats,
  WebsiteTypeStatsResponse,
} from "../api/getWebsiteTypeStats";

const useWebsiteTypeStats = () => {
  const { data, isLoading, error, refetch } =
    useQuery<WebsiteTypeStatsResponse>({
      queryKey: ["website-type-stats"],
      queryFn: () => getWebsiteTypeStats(),
      staleTime: 1000 * 60 * 5,
    });

  return {
    websiteTypes: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
};

export default useWebsiteTypeStats;
