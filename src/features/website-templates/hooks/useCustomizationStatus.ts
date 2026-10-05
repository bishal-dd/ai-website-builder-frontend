import { useQuery } from "@tanstack/react-query";
import { getCustomizationStatus } from "../api/getCustomizationStatus";

export function useCustomizationStatus({
  websiteId,
  jobId,
}: {
  websiteId: string;
  jobId: string | null;
}) {
  return useQuery({
    queryKey: ["customization-status", websiteId, jobId],

    queryFn: () =>
      getCustomizationStatus({
        websiteId,
        jobId: jobId!,
      }),

    enabled: Boolean(websiteId && jobId),

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "completed" || status === "failed") {
        return false;
      }

      return 1500;
    },
  });
}
