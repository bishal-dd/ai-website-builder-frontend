import { useQuery } from "@tanstack/react-query";
import { getWebsiteDetails } from "../api/getWebsiteDetails";

const useGetWebsiteDetails = (websiteId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["website-details", websiteId],
    queryFn: () => getWebsiteDetails(websiteId),
    enabled: !!websiteId,
  });

  return { data, isLoading, error };
};

export default useGetWebsiteDetails;
