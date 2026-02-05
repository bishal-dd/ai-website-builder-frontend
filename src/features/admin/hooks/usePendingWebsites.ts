import { useQuery } from "@tanstack/react-query";
import { getPendingWebsites, WebsiteResponse } from "../api/getPendingWebsites";

// 1. Accept page as a parameter alongside searchQuery
const usePendingWebsites = (searchQuery: string = "", page: number = 1) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<WebsiteResponse>({
      // 2. QueryKey now depends on both search and page
      queryKey: ["pending-websites", searchQuery, page],

      // 3. Pass both to your API function
      queryFn: () => getPendingWebsites(searchQuery, page),

      staleTime: 1000 * 60,
      // Keep the old data visible while the new page is loading (avoids flickering)
      placeholderData: (previousData) => previousData,
    });

  return {
    websites: data?.websites ?? [],
    pagination: data?.pagination,
    isLoading,
    isPlaceholderData, // Useful for showing a loading overlay on the table
    error,
    refetch,
  };
};

export default usePendingWebsites;
