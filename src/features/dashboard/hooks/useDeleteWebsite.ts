import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWebsite } from "../api/deleteWebsite";

export default function useDeleteWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (websiteId: string) => deleteWebsite(websiteId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
