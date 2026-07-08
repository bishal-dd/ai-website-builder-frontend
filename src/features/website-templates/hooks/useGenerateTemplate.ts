import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateUseTemplate } from "../api/generateUseTemplate";

export interface GenerateTemplateParams {
  templateId: string;
  title?: string;
}

export function useGenerateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GenerateTemplateParams) => generateUseTemplate(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
