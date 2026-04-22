import { useQuery } from "@tanstack/react-query";
import { getAdminContacts, ContactsResponse } from "../api/getAdminContacts";

const useAdminContacts = (
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  date: string = "",
  startDate: string = "",
  endDate: string = "",
) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<ContactsResponse>({
      queryKey: [
        "admin-contacts",
        page,
        pageSize,
        search,
        date,
        startDate,
        endDate,
      ],

      queryFn: () =>
        getAdminContacts({
          page,
          pageSize,
          search,
          date,
          startDate,
          endDate,
        }),

      staleTime: 1000 * 60,
      placeholderData: (previousData) => previousData,
    });

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isPlaceholderData,
    error,
    refetch,
  };
};

export default useAdminContacts;
