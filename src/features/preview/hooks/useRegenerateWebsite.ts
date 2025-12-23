import { useMutation } from "@tanstack/react-query";
import {
  regenerateWebsite,
  RegenerateWebsitePayload,
} from "../api/regenerateWebsite";

export function useRegenerateWebsite() {
  return useMutation({
    mutationFn: (payload: RegenerateWebsitePayload) =>
      regenerateWebsite(payload),
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to regenerate website:", error.message);
      } else {
        console.error("Failed to regenerate website:", error);
      }
    },
    onSuccess: (data) => {
      console.log("Website regeneration started:", data);
    },
  });
}
