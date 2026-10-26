import { useQuery } from "@tanstack/react-query";
import { getFeedback, type GetFeedbackParams } from "../api/getFeedback";

export const useFeedback = (params: GetFeedbackParams = {}) => {
  return useQuery({
    queryKey: ["feedback", params],
    queryFn: () => getFeedback(params),
    placeholderData: (previousData) => previousData,
  });
};
