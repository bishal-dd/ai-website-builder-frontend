import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDomainPriceAPI } from "../api/domainService";

const useUpdateDomainPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      domainId,
      domainPrice,
    }: {
      domainId: string;
      domainPrice: number;
    }) =>
      updateDomainPriceAPI({
        id: domainId,
        domainPrice,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["domain", variables.domainId],
      });

      queryClient.invalidateQueries({
        queryKey: ["domains"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-websites"],
      });
    },
  });
};

export default useUpdateDomainPrice;
