import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDomainEmailDnsRecords } from "../api/saveDomainEmailDnsRecords";
import type { SaveEmailDnsInput } from "../types/dns";

export const useSaveDomainEmailDnsRecords = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveEmailDnsInput) => saveDomainEmailDnsRecords(input),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["domain-email-dns-records", variables.domainId],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-domains"],
      });
    },
  });
};
