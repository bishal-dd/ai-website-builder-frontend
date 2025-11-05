import { getPreviewWebsite } from "@/features/preview/api/getPreviewWebsite";
import { useQuery } from "@tanstack/react-query";

const useGetGeneratedWebsite = (websiteId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["website", websiteId],
    queryFn: () => getPreviewWebsite(websiteId),
  });

  return { data, isLoading, error };
};

export default useGetGeneratedWebsite;
