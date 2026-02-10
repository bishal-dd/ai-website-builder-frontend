import { useQuery } from "@tanstack/react-query";
import { getAdminWebsites, WebsiteResponse } from "../api/getAdminWebsites";

const useAdminWebsites = (
  searchQuery: string = "",
  page: number = 1,
  status: string = "pending",
) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<WebsiteResponse>({
      queryKey: ["admin-websites", searchQuery, page, status],

      queryFn: () =>
        getAdminWebsites({
          websiteId: searchQuery,
          page,
          status,
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

export default useAdminWebsites;
