import { useQuery } from "@tanstack/react-query";
import { getWebsitePayment, Payment } from "../api/getWebsitePayment";

const useWebsitePayment = (websiteId?: string) => {
  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = useQuery<Payment | null>({
    queryKey: ["website-payment", websiteId],
    queryFn: () => getWebsitePayment(websiteId!),
    enabled: !!websiteId,
    staleTime: 1000 * 60,
  });

  return {
    payment: payment ?? null,
    isLoading,
    error,
    refetch,
  };
};

export default useWebsitePayment;
