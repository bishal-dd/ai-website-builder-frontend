import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedbackStatus } from "../api/updateFeedbackStatus";
import type { FeedbackStatus } from "../types/feedback";

type UpdateFeedbackStatusVariables = {
  id: string;
  status: FeedbackStatus;
};

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateFeedbackStatusVariables) =>
      updateFeedbackStatus(id, status),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["feedback"],
      });
    },
  });
}
