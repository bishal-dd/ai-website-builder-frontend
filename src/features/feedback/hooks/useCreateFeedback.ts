import { useMutation } from "@tanstack/react-query";

import { createFeedback } from "../api/createFeedback";
import type { CreateFeedbackInput } from "../types/feedback";

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: (input: CreateFeedbackInput) => createFeedback(input),
  });
};
