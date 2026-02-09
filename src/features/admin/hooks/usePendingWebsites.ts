import { useQuery } from "@tanstack/react-query";
import { getPendingWebsites, WebsiteResponse } from "../api/getPendingWebsites";

// 1. Accept page as a parameter alongside searchQuery
const usePendingWebsites = (searchQuery: string = "", page: number = 1) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<WebsiteResponse>({
      queryKey: ["pending-websites", searchQuery, page],

      // Pass object instead of separate args
      queryFn: () =>
        getPendingWebsites({
          websiteId: searchQuery,
          page,
        }),

      staleTime: 1000 * 60,
      placeholderData: (previousData) => previousData,
    });

  return {
    websites: data?.websites ?? [],
    pagination: data?.pagination,
    isLoading,
    isPlaceholderData,
    error,
    refetch,
  };
};

export default usePendingWebsites;
