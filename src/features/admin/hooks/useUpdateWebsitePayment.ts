import { useMutation } from "@tanstack/react-query";
import {
  updateWebsitePayment,
  Payment,
  PaymentUpdate,
} from "../api/updateWebsitePayment";

const useUpdateWebsitePayment = (onSuccess?: (payment: Payment) => void) => {
  const mutation = useMutation({
    mutationFn: ({
      websiteId,
      data,
    }: {
      websiteId: string;
      data: PaymentUpdate;
    }) => updateWebsitePayment(websiteId, data),

    onSuccess,
  });

  return {
    updatePayment: mutation.mutate,
    updatePaymentAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useUpdateWebsitePayment;
