import { useQuery } from "@tanstack/react-query";
import {
  getWebsitesByType,
  WebsitesByTypeResponse,
} from "../api/getWebsitesByType";

const useWebsitesByType = (
  type: string,
  page: number = 1,
  status: string = "",
) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<WebsitesByTypeResponse>({
      queryKey: ["websites-by-type", type, page, status],
      queryFn: () =>
        getWebsitesByType({
          type,
          page,
          status,
        }),
      enabled: !!type,
      staleTime: 1000 * 60,
      placeholderData: (previousData) => previousData,
    });

  return {
    websites: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isPlaceholderData,
    error,
    refetch,
  };
};

export default useWebsitesByType;
