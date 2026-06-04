import { useQuery } from "@tanstack/react-query";
import { getDomainEmailDnsRecords } from "../api/getDomainEmailDnsRecords";

export const useGetDomainEmailDnsRecords = (domainId?: string) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["domain-email-dns-records", domainId],
    queryFn: () => getDomainEmailDnsRecords(domainId!),
    enabled: Boolean(domainId),
    staleTime: 1000 * 60,
  });

  return {
    emailDnsData: data,
    records: data?.records ?? [],
    domain: data?.domain,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
