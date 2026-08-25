import { useMutation } from "@tanstack/react-query";
import { generateWebsiteInvoice } from "../api/generateWebsiteInvoice";

export function useGenerateWebsiteInvoice() {
  return useMutation({
    mutationFn: (websiteId: string) => generateWebsiteInvoice(websiteId),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to generate website invoice:", error.message);
      } else {
        console.error("Failed to generate website invoice:", error);
      }
    },

    onSuccess: () => {
      console.log("Website invoice generated successfully");
    },
  });
}
