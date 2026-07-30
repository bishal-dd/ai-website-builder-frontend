import { deletePageSection } from "@/features/preview/api/deletePageSection";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeletePageSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      sectionId,
    }: {
      pageId: string;
      sectionId: number;
    }) => deletePageSection(pageId, { sectionId }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["page", variables.pageId],
      });
    },

    onError: (error) => {
      console.error("Failed to delete section:", error);
    },
  });
};

export default useDeletePageSection;
