import { deletePage } from "@/features/preview/api/deletePage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId }: { pageId: string; websiteId: string }) =>
      deletePage(pageId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["website", variables.websiteId],
      });
    },
  });
};

export default useDeletePage;
