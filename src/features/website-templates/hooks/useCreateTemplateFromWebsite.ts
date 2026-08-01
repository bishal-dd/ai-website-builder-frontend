import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplateFromWebsite } from "../api/createTemplateFromWebsite";

export interface CreateTemplateFromWebsiteParams {
  websiteId: string;
}

export function useCreateTemplateFromWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTemplateFromWebsiteParams) =>
      createTemplateFromWebsite(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["templates"],
      });
    },
  });
}
