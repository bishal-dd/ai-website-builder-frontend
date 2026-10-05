import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateSetupWebsite } from "../api/generateSetupWebsite";

export interface SetupWebsiteParams {
  websiteId: string;
  title: string;
  description: string;
}

export function useSetupWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SetupWebsiteParams) => generateSetupWebsite(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
