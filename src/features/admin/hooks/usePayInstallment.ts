import { useMutation } from "@tanstack/react-query";
import { payInstallment, PayInstallmentInput } from "../api/payInstallment";

export function usePayInstallment(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (paymentData: PayInstallmentInput) =>
      payInstallment(paymentData),
    onSuccess,
  });
}
