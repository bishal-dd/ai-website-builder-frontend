import { useMutation } from "@tanstack/react-query";
import { generatePreviewTemplate } from "../api/generatePreviewTemplate";

export function useGeneratePreviewTemplate() {
  return useMutation({
    mutationFn: (templateId: string) => generatePreviewTemplate(templateId),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to generate preview template:", error.message);
      } else {
        console.error("Failed to generate preview template:", error);
      }
    },

    onSuccess: (data) => {
      console.log("Preview template generated:", data);
    },
  });
}
