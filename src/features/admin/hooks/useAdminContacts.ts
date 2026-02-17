import { useQuery } from "@tanstack/react-query";
import { getAdminContacts, ContactsResponse } from "../api/getAdminContacts";

const useAdminContacts = (
  page: number = 1,
  pageSize: number = 10,
  search: string = "", // 1️⃣ Add search parameter
) => {
  const { data, isLoading, isPlaceholderData, error, refetch } =
    useQuery<ContactsResponse>({
      // 2️⃣ Add search to queryKey so cache resets on new searches
      queryKey: ["admin-contacts", page, pageSize, search],

      queryFn: () =>
        getAdminContacts({
          page,
          pageSize,
          search, // 3️⃣ Pass search to the API function
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
