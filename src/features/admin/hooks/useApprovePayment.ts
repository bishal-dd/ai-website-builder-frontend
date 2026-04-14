import { useMutation } from "@tanstack/react-query";
import { approvePayment, PaymentInput } from "../api/approvePayment";

export function useApprovePayment(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (paymentData: PaymentInput) => approvePayment(paymentData),
    onSuccess,
  });
}
