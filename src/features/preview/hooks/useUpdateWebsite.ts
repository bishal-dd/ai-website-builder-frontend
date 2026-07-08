import { updateWebsite } from "@/features/preview/api/updateWebsite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WebsiteUpdate } from "../types";

const useUpdateWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      websiteId,
      body,
    }: {
      websiteId: string;
      body: WebsiteUpdate;
    }) => updateWebsite(websiteId, body),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["website", variables.websiteId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export default useUpdateWebsite;
