import { useQuery } from "@tanstack/react-query";
import { getDomainEmailForwarding } from "../api/getDomainEmailForwarding";

export function useGetDomainEmailForwarding(domainId: string) {
  return useQuery({
    queryKey: ["domain-email-forwarding", domainId],
    queryFn: () => getDomainEmailForwarding(domainId),
    enabled: Boolean(domainId),
  });
}
