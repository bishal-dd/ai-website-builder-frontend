import { useMutation } from "@tanstack/react-query";
import { approvePayment } from "../api/approvePayment";

export function useApprovePayment(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (websiteId: string) => approvePayment(websiteId),
    onSuccess,
  });
}
