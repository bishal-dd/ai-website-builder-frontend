import { updateWebsitePage } from "@/features/preview/api/updateWebsitePage";
import { useMutation } from "@tanstack/react-query";
import type { PageUpdate } from "../types";

const useUpdateWebsitePage = () => {
  return useMutation({
    mutationFn: ({ pageId, body }: { pageId: string; body: PageUpdate }) =>
      updateWebsitePage(pageId, body),
  });
};

export default useUpdateWebsitePage;
