import { useQuery } from "@tanstack/react-query";
import { getWebsiteDomains } from "../api/getWebsiteDomains";

const useGetWebsiteDomains = (websiteId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["website-domains", websiteId],
    queryFn: () => getWebsiteDomains(websiteId),
    // Optional: Only run query if websiteId exists
    enabled: !!websiteId,
  });

  return { data, isLoading, error };
};

export default useGetWebsiteDomains;
