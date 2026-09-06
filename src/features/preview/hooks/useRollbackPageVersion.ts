import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rollbackPageVersion } from "../api/rollbackPageVersion";

export function useRollbackPageVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      versionId,
    }: {
      pageId: string;
      versionId: string;
    }) => rollbackPageVersion(pageId, versionId),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Failed to rollback page version:", error.message);
      } else {
        console.error("Failed to rollback page version:", error);
      }
    },

    onSuccess: (data, variables) => {
      console.log("Page version rolled back:", data);

      queryClient.invalidateQueries({
        queryKey: ["website"],
      });

      queryClient.invalidateQueries({
        queryKey: ["page-versions", variables.pageId],
      });
    },
  });
}
