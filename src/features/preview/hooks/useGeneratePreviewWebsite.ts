import { useMutation } from "@tanstack/react-query";
import { generatePreviewWebsite } from "../api/generatePreviewWebsite";

export function useGeneratePreviewWebsite() {
  return useMutation({
    mutationFn: (websiteId: string) => generatePreviewWebsite(websiteId),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to generate preview website:", error.message);
      } else {
        console.error("Failed to generate preview website:", error);
      }
    },

    onSuccess: (data) => {
      console.log("Preview website generated:", data);
    },
  });
}
