import { reorderPageSections } from "@/features/preview/api/reorderPageSections";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useReorderPageSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      sectionIds,
    }: {
      pageId: string;
      sectionIds: number[];
    }) =>
      reorderPageSections(pageId, {
        sectionIds,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["page", variables.pageId],
      });
    },
  });
};

export default useReorderPageSections;
