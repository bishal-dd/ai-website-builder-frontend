import { useQuery } from "@tanstack/react-query";

import { previewImportedWebsite } from "../api/previewImportedWebsite";

export function usePreviewImportedWebsite(importId: string | undefined) {
  return useQuery({
    queryKey: ["website-imports", "preview", importId],
    queryFn: () => {
      if (!importId) {
        throw new Error("Import ID is required");
      }

      return previewImportedWebsite(importId);
    },
    enabled: Boolean(importId),
    retry: false,
  });
}
