import { updateWebsite } from "@/features/preview/api/updateWebsite";
import { useMutation } from "@tanstack/react-query";
import type { WebsiteUpdate } from "../types";

const useUpdateWebsite = () => {
  return useMutation({
    mutationFn: ({
      websiteId,
      body,
    }: {
      websiteId: string;
      body: WebsiteUpdate;
    }) => updateWebsite(websiteId, body),
  });
};

export default useUpdateWebsite;
