import { useMutation } from "@tanstack/react-query";
import {
  createWebsitePayment,
  Payment,
  PaymentInput,
} from "../api/createWebsitePayment";

const useCreateWebsitePayment = (onSuccess?: (payment: Payment) => void) => {
  const mutation = useMutation({
    mutationFn: (data: PaymentInput) => createWebsitePayment(data),

    onSuccess,
  });

  return {
    createPayment: mutation.mutate,
    createPaymentAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useCreateWebsitePayment;
