import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { initiateDomainTransfer } from "../api/initiateDomainTransfer";

export const useTransferDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      domainId,
      domainName,
      userEmail,
    }: {
      domainId: string;
      domainName: string;
      userEmail: string;
    }) => initiateDomainTransfer(domainId, domainName, userEmail),

    onSuccess: () => {
      // Invalidate the domains list to refetch fresh data from DB
      queryClient.invalidateQueries({ queryKey: ["user-domains"] });
      toast.success("Transfer request sent to the team.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate transfer.");
    },
  });
};
