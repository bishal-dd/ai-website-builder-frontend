import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDomainEmailDnsRecord } from "../api/deleteDomainEmailDnsRecord";
import type { EmailDnsRecord } from "../types/dns";

export const useDeleteDomainEmailDnsRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      domainId,
      record,
    }: {
      domainId: string;
      record: EmailDnsRecord;
    }) => deleteDomainEmailDnsRecord({ domainId, record }),

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
