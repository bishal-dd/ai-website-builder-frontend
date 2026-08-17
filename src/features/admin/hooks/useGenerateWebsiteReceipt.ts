import { useMutation } from "@tanstack/react-query";
import { generateWebsiteReceipt } from "../api/generateWebsiteReceipt";

export function useGenerateWebsiteReceipt() {
  return useMutation({
    mutationFn: (websiteId: string) => generateWebsiteReceipt(websiteId),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to generate website receipt:", error.message);
      } else {
        console.error("Failed to generate website receipt:", error);
      }
    },

    onSuccess: () => {
      console.log("Website receipt generated successfully");
    },
  });
}
