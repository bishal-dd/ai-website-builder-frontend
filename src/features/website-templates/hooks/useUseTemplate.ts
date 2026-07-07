import { useMutation } from "@tanstack/react-query";
import { generateUseTemplate } from "../api/generateUseTemplate";

interface UseTemplateParams {
  templateId: string;
  title?: string;
}

export function useUseTemplate() {
  return useMutation({
    mutationFn: (params: UseTemplateParams) => generateUseTemplate(params),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to use template:", error.message);
      } else {
        console.error("Failed to use template:", error);
      }
    },

    onSuccess: (data) => {
      console.log("Template instantiated:", data);
    },
  });
}
